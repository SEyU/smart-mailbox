from flask import Flask, abort, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import pymongo
import datetime

app = Flask(__name__)
app.debug = True
CORS(app)

API_KEY = "test api key"
MONGO_HOST = "mongo"
MONGO_PORT = 27017

class MongoDBRepository:

    def __init__(self):
        self.db = MongoClient(MONGO_HOST, MONGO_PORT).sello

    def findAllMeasures(self):
        return [x for x in self.db.measures.find({}, {"_id": 0}).sort("ocurredOn", pymongo.DESCENDING)]

    def createMeasures(self, temp, hum):
        self.db.measures.insert_one({"temp": temp, "hum": hum, "ocurredOn": datetime.datetime.now()})
        return True

    def findAllDoorEvents(self):
        return [x for x in self.db.door_opened.find({}, {"_id": 0}).sort("ocurredOn", pymongo.DESCENDING)]

    def createDoorEvent(self):
        self.db.door_opened.insert_one({"ocurredOn": datetime.datetime.now()})
        return True

    def findAllLetterEvents(self):
        return [x for x in self.db.letter_introduced.find({}, {"_id": 0}).sort("ocurredOn", pymongo.DESCENDING)]

    def createLetterEvent(self):
        self.db.letter_introduced.insert_one({"ocurredOn": datetime.datetime.now()})
        return True
    
    def isInboxEmpty(self):
        letter = [x for x in self.db.letter_introduced.find({}, {"_id": 0}).sort("ocurredOn", pymongo.DESCENDING).limit(1)][0]
        door = [x for x in self.db.door_opened.find({}, {"_id": 0}).sort("ocurredOn", pymongo.DESCENDING).limit(1)][0]
        if letter['ocurredOn'] > door['ocurredOn']:
            return False
        return True

def check_api_key():
    if request.headers.get('X-Api-Key') != API_KEY:
        abort(401)

@app.route("/letter", methods=['POST', 'GET'])
def introduce_letter():
    check_api_key()
    mongo_repo = MongoDBRepository()

    if request.method == 'GET':
        return jsonify(mongo_repo.findAllLetterEvents())
    
    mongo_repo.createLetterEvent()
    return "LETTER_INTRODUCED_EVENT registered successfully"

@app.route("/door", methods=['POST', 'GET'])
def open_door():
    check_api_key()
    mongo_repo = MongoDBRepository()

    if request.method == 'GET':
        return jsonify(mongo_repo.findAllDoorEvents())
    
    mongo_repo.createDoorEvent()

    return "DOOR_OPENED_EVENT registered successfully"

@app.route("/measures", methods=['POST', 'GET'])
def measures():
    check_api_key()
    mongo_repo = MongoDBRepository()

    if request.method == 'GET':
        return jsonify(mongo_repo.findAllMeasures())

    temp = request.values['temp']
    hum = request.values['hum']
    
    mongo_repo.createMeasures(temp, hum)
    return "New temperature measure registered successfully"

@app.route("/empty", methods=['GET'])
def empty():
    check_api_key()
    mongo_repo = MongoDBRepository()
    return jsonify({"empty": mongo_repo.isInboxEmpty()})


