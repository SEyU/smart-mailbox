#include <Arduino.h>
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <SSD1306.h>
#include <DHT.h>
#include <ESPAsyncTCP.h>
#include <SyncClient.h>
#include "fonts.h"
#include "config.h"

const int dhtPin = D5;
const int ledPin = D6;
const int ldrPin = A0;
const int topPin = D2;
const int doorPin = D1;

const int ledInterval = 100;
const int screenInterval = 1000;
const int dhtInterval = 60000;
const int doorInterval = 1000;
const int ldrThreshold = 100;

int ledMillis = 0;
int screenMillis = 0;
int dhtMillis = 0;
int doorMillis = 0;

float temperature = 0;
float humidity = 0;
int ldrLast = 0;
int mailCount = 0;
bool mailIn = false;

bool topStatus = false;
bool doorStatus = false;

SSD1306 display(0x3c, D3, D4);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, 7200); // UTC + 2 -> 7200 sec. offset.
DHT dht(dhtPin, DHT22);

void setup() {
  display.init();
  display.flipScreenVertically();
  display.setFont(Roboto_Medium_20);

  display.clear();
  display.setTextAlignment(TEXT_ALIGN_CENTER);
  display.drawString(64, 0, String("Conectando..."));
  display.display();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  display.drawString(64, 20, "¡Conectado!");
  display.drawString(64, 40, WiFi.localIP().toString());
  display.display();

  timeClient.begin();
  dht.begin();
  pinMode(ledPin, OUTPUT);
  pinMode(ldrPin, INPUT);
  pinMode(topPin, INPUT_PULLUP);
  pinMode(doorPin, INPUT_PULLUP);

  Serial.begin(9600);
}

void notify(String path) {
  unsigned long startMillis = millis();
  SyncClient client;
  if(!client.connect(apiURL, apiPort)){
    Serial.println("Connection failed.");
    return;
  }
  client.setTimeout(2);
  if(client.printf("POST /%s HTTP/1.1\r\nHost: mailbox.clanlr.net\r\nX-Api-Key: %s\r\n\r\n",
                   path.c_str(), apiKey) > 0){
    while(client.connected() && client.available() == 0){
      delay(1);
    }
//    While(client.available()){
//      Serial.write(client.read());
//    }
//    Serial.println("");
    if(client.connected()){
      client.stop();
    }
    Serial.printf("POST /%s OK. Time = %u ms.\n", path.c_str(), millis() - startMillis);
  } else {
    client.stop();
    Serial.println("Send failed.");
    while(client.connected()) delay(1);
  }
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - ledMillis >= ledInterval) {
    ledMillis = currentMillis;

    if (digitalRead(doorPin)) {
      digitalWrite(ledPin, LOW);
      ldrLast = 0;
      mailCount = 0;
    } else if (digitalRead(topPin)) {
      digitalWrite(ledPin, HIGH);
      if (ldrLast == 0) {
        delay(500);
        ldrLast = analogRead(ldrPin);
        Serial.printf("LDR initial value = %d\n", ldrLast);
      } else {
        int ldrCurr = analogRead(ldrPin);
        if (ldrCurr - ldrLast > ldrThreshold) {
          if (!mailIn) {
            Serial.printf("DEBUG ldrCurr = %d, ldrLast = %d, diff = %d\n", ldrCurr, ldrLast, ldrCurr - ldrLast);
            mailCount += 1;
            mailIn = true;
            notify("letter");
          }
        } else {
          mailIn = false;
        }
      }
    } else {
      digitalWrite(ledPin, LOW);
      ldrLast = 0;
    }
  }

  if (currentMillis - doorMillis >= doorInterval) {
    doorMillis = currentMillis;

    int doorCurr = digitalRead(doorPin);
    int topCurr = digitalRead(topPin);
    if (doorCurr && !doorStatus) {
      doorStatus = true;
      notify("door");
    } else if (!doorCurr && doorStatus) {
      doorStatus = false;
      notify("door/close");
    }
    if (topCurr && !topStatus) {
      topStatus = true;
      notify("top");
    } else if (!topCurr && topStatus) {
      topStatus = false;
      notify("top/close");
    }
  }

  if (currentMillis - screenMillis >= screenInterval) {
    screenMillis = currentMillis;

    timeClient.update();
    display.clear();
    display.setTextAlignment(TEXT_ALIGN_CENTER);
    display.drawString(64, 0, timeClient.getFormattedTime());
    display.drawString(64, 40, String(temperature, 1) + " C " + String(humidity, 1) + " %");
    display.setTextAlignment(TEXT_ALIGN_LEFT);
    display.drawString(40, 20, String(mailCount));
    display.drawXbm(65, 22, mail_width, mail_height, mail_bits);
    display.display();
  }

  if (currentMillis - dhtMillis >= dhtInterval) {
    dhtMillis = currentMillis;

    float h = dht.readHumidity();
    float t = dht.readTemperature();
    if (!isnan(h) && !isnan(t)) {
      humidity = h;
      temperature = t;
    }
    String path;
    notify(String("measures?temp="+ String(temperature, 1) + "&hum=" + String(humidity, 1)));
  }
}
