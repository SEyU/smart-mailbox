from flask import Flask, abort, request, jsonify
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
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

    def findAllDoorEvents(self):
        return [x for x in self.db.door_opened.find({}, {"_id": 0})]

    def createDoorEvent(self):
        self.db.door_opened.insert_one({"ocurredOn": datetime.datetime.now()})
        return True

    def findAllLetterEvents(self):
        return [x for x in self.db.letter_introduced.find({}, {"_id": 0})]

    def createLetterEvent(self):
        self.db.letter_introduced.insert_one({"ocurredOn": datetime.datetime.now()})
        return True
    
    def isInboxEmpty(self):
        letter = self.db.door_opened.find_one({}, {"_id": 0})
        door = self.db.door_opened.find_one({}, {"_id": 0})
        if letter.ocurredOn > door.ocurredOn:
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

@app.route("/temp", methods=['POST'])
def temperature_entry():
    check_api_key()
    return "New temperature measure registered successfully"

@app.route("/empty", methods=['GET'])
def empty():
    check_api_key()
    return jsonify({"empty": True})


