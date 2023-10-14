import json
from flask import Flask, request, render_template, redirect 
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS
import pickle
import pandas as pd
import os
from dotenv import load_dotenv
import base64
from requests import post , get
import math
load_dotenv() 
f = open('userid.txt', 'w')
f.close()
client_id=os.getenv("CLIENT_ID")
client_secret= os.getenv("CLIENT_SECRET")
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
CORS(app)
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


def get_token():
    print(client_id)
    print(client_secret)
    auth_string=   client_id + ":" + client_secret
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = str(base64.b64encode(auth_bytes),"utf-8")
    url= "https://accounts.spotify.com/api/token"
    headers={
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data={"grant_type": "client_credentials"}
    result=post(url,headers=headers,data=data)
    json_result = result.json()
    token = json_result["access_token"]
    return token
def get_auth_header(token):
    headers = {
        "Authorization": "Bearer " + token
    }
    return headers
def searchForArtist(token , artist_name):
    url="https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query=f"?q={artist_name}&type=artist&limit=5"
    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = result.json()
    return json_result["artists"]["items"]

def searchForSong(token, text):
    url="https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query=f"?q={text}&type=track&limit=5"
    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = result.json()
    return json_result["tracks"]["items"]

def searchForAlbums(token, album_name):
    url="https://api.spotify.com/v1/search" 
    headers= get_auth_header(token)
    query=f"?q={album_name}&type=album&limit=5"
    query_url=url+query
    result = get(query_url, headers=headers)
    json_result = result.json()
    return json_result["albums"]["items"]

def get_songs_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    header = get_auth_header(token)
    result = get(url, headers=header)
    json_result = result.json()
    return json_result

@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401
    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response

@app.route('/songs', methods=['GET'])
def get_songs():
    data = pd.read_pickle("recommended_songs.pkl")
    page = request.args.get('page', type=int, default=1)
    items_per_page = request.args.get('itemsPerPage', type=int, default=30)
    total_songs = len(data)
    total_pages = math.ceil(total_songs / items_per_page)

    start = (page - 1) * items_per_page
    end = min(start + items_per_page, total_songs)

    songs = []
    token = get_token()
    for _, song in data.iloc[start:end].iterrows():
        track_name = song["track_name"]
        song_info = searchForSong(token, track_name)
        if song_info:
            songs.append(song_info[0].copy())
            songs[-1].update(song.to_dict())

    return jsonify(songs)


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
    
@app.route('/search', methods=['POST'])
def search():
    if request.method == 'POST':
        data = request.json['data']
        token = get_token()

        artists = searchForArtist(token, data)
        songs = searchForSong(token, data)
        albums = searchForAlbums(token, data)
        search_results = {
            "artists": artists,
            "songs": songs,
            "albums": albums
        }
        print(search_results)
        return jsonify(search_results), 200


if __name__ == '__main__':
	app.run(debug=True)
