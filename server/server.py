import json
from flask import Flask, request, render_template, redirect 
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager

import pickle
import pandas as pd

f = open('userid.txt', 'w')
f.close()

def writeFile(string):
    f = open('userid.txt', 'w')
    f.write(string)
    print(string)
    f.close()

def readFile():
    f = open('userid.txt', 'r')
    v=f.readline()
    return v

def ClearFile():
    f= open('userid.txt','w')
    f.seek(0) 
    f.truncate() 
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
db = SQLAlchemy(app)

class User(db.Model):
    __tableName__='user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(90) , unique=True)
    password = db.Column(db.String(120))

class History(db.Model):
    __tableName__='history'
    user_id = db.Column(db.ForeignKey("user.id"))
    id = db.Column(db.Integer, primary_key=True)
    songs = db.Column(db.Text)
    content = db.Column(db.Text)

with app.app_context():
    db.create_all()
with app.app_context():
    users=User.query.all()

app.config["JWT_SECRET_KEY"] = "hello-world"
jwt = JWTManager(app)

@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401
    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response

@app.route('/songs',methods=['GET'])
def get_data():
    data = pd.read_pickle("recommended_songs.pkl")
    print(data)
    return data.to_json() , 200

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    try:
        # if(readFile()):
        #     return "SUCCESS", 200
        if request.method == 'POST':
            username = request.json['username']
            email = request.json['email']
            password = request.json['password']
            user_exists = User.query.filter_by(username=username).first()
            if user_exists:
                return jsonify({"status":"Already exists", "username":user_exists.username, "mail": user_exists.email}), 401
            hashed_password = generate_password_hash(password)
            user = User(username=username, email=email ,password=hashed_password)
            db.session.add(user)
            db.session.commit()
            user = User.query.filter_by(username=username).first()
            userId=str(user.id)
            print(userId)
            writeFile(userId)
            print(user.username)
            return jsonify({"status":"Success", "username":user.username, "mail": user.email})
        else:
            return jsonify({"status":"UnSuccessful", "username":user.username, "mail": user.email})
    except Exception as e:
        print(e) 
        return "Error", 400

@app.route('/login', methods=['GET', 'POST'])
def login():
        if request.method == 'POST':
            bool=True
            email = request.json['email']
            password = request.json['password']
            user_exists = User.query.filter_by(email=email).first()
            if not user_exists or not check_password_hash(user_exists.password,password):
                return jsonify({"status":"UnSuccessful", "username":user_exists.username, "mail": user_exists.email})
            user= User.query.filter_by(email=email).first()
            userId=str(user.id)
            print(userId)
            writeFile(userId)
            return jsonify({"status":"Success","username":user.username,"mail": user.email})

@app.route("/logout", methods=["POST"])
def signout():
    if(readFile()):
        ClearFile()
        return jsonify({"status":"Success"})
    else:
        return jsonify({"status":"UnSuccessful"})

if __name__ == '__main__':
	app.run(debug=True)
