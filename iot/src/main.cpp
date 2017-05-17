#include <Arduino.h>
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <SSD1306.h>
#include <DHT.h>

#include "fonts.h"
#include "config.h"

const int dhtPin = D5;
const int ledPin = D6;
const int ldrPin = A0;
const int topPin = D2;
const int doorPin = D1;

const int ledInterval = 100;
const int screenInterval = 1000;
const int dhtInterval = 10000;
const int ldrThreshold = 50;

int ledMillis = 0;
int screenMillis = 0;
int dhtMillis = 0;

float temperature = 0;
float humidity = 0;
int ldrLast = 0;
int mailCount = 0;

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
      delay(200);
      int ldrValue = analogRead(ldrPin);
      if (ldrLast == 0) {
        ldrLast = ldrValue;
        Serial.print("Initial value = ");
        Serial.println(abs(ldrLast));
      } else {
        int ldrDiff = ldrLast - ldrValue;
        if (abs(ldrDiff) > ldrThreshold) {
          mailCount += 1;
          delay(500);
          Serial.print("New mail! Diff = ");
          Serial.println(abs(ldrDiff));
          ldrLast = analogRead(ldrPin);
        }
      }
    } else {
      digitalWrite(ledPin, LOW);
      ldrLast = 0;
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
  }
}
