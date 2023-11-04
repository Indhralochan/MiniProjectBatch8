import json
from flask import Flask, request, render_template, redirect 
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, DateTime, func
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
from flask_cors import CORS
import pickle
import pandas as pd
import random
import base64
import os
from urllib.parse import urlencode
from dotenv import load_dotenv
import base64
from requests import post , get
import math
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from spotipy.oauth2 import SpotifyOAuth

load_dotenv() 


client_id=os.getenv("CLIENT_ID")
client_secret= os.getenv("CLIENT_SECRET")
sp_oauth = SpotifyOAuth(
    os.getenv("CLIENT_ID"),
    os.getenv("CLIENT_SECRET"),
    os.getenv("REDIRECT_URI"),
)
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

CORS(app)

class UserRating(db.Model):
    __tablename__ = 'user_ratings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String)
    song_id = db.Column(db.String)
    rating = db.Column(db.Integer)
    review_text = db.Column(db.String)
    timestamp = db.Column(DateTime, default=func.now())

class UserHistory(db.Model):
    __tablename__ = 'user_history'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String)
    song_id = db.Column(db.String)
    timestamp = db.Column(DateTime, default=func.now())

with app.app_context():
    db.create_all()
    
data = pd.read_pickle("recommended_songs.pkl")

access_token = ''
def generate_random_string(length):
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return ''.join(random.choice(possible) for _ in range(length))

def get_token():
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
    query=f"?q={text}&type=track&limit=1"
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
def searchForTrack(token, track):
    url="https://api.spotify.com/v1/tracks/%s" % track
    headers = {
    'Authorization': f'Bearer {token}'
    }
    response = get(url, headers=headers)
    json_result = response.json()
    return json_result

def get_songs_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    header = get_auth_header(token)
    result = get(url, headers=header)
    json_result = result.json()
    return json_result


@app.route('/songs', methods=['GET'])
def get_songs():
    page = request.args.get('page', type=int, default=1)
    items_per_page = request.args.get('itemsPerPage', type=int, default=15)
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
            song_data = song_info[0].copy()
            song_data.update(song.to_dict())
            songs.append(song_data)

    return jsonify(songs)


@app.route('/refresh', methods=['POST'])
def refresh_token():
    try:
        refresh_token = request.json['refreshToken']
        access_token_info = sp_oauth.refresh_access_token(refresh_token)
        if access_token_info:
            return jsonify({"accessToken": access_token_info['access_token'], "expiresIn": access_token_info['expires_at']})
        else:
            return jsonify({"error": "Failed to refresh access token"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    try:
        code = request.json['code']
        access_token_info = sp_oauth.get_access_token(code)
        print(access_token_info)
        if access_token_info:
            return jsonify({
                "accessToken": access_token_info['access_token'],
                "refreshToken": access_token_info.get('refresh_token'),
                "expiresIn": access_token_info['expires_in']
            })
        else:
            return jsonify({"error": "Failed to log in"}), 400
    except Exception as e:
        return jsonify({"error": "Failed to log in"}), 400

# @app.route("/logout", methods=["POST"])
# def signout():
#     if(readFile()):
#         ClearFile()
#         return jsonify({"status":"Success"})
#     else:
#         return jsonify({"status":"UnSuccessful"})
    
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

@app.route('/rate-song', methods=['POST'])
def rate_song():
    try:
        user_id = request.json.get("user_id")
        song_id = request.json.get("song_id")
        rating = request.json.get("rating")
        review_text = request.json.get("review_text" , 'none')
        existing_rating = UserRating.query.filter_by(user_id=user_id, song_id=song_id).first()
        if existing_rating:
            if rating is not None:
                existing_rating.rating = rating
            if review_text is not None:
                existing_rating.review_text = review_text
        else:
            # Create a new rating and review entry
            new_rating = UserRating(user_id=user_id, song_id=song_id, rating=rating, review_text=review_text)
            db.session.add(new_rating)
        db.session.commit()
        return jsonify({"message": "Rating and review saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-to-history', methods=['POST'])
def add_to_history():
    try:
        user_id = request.json.get("user_id")
        song_id = request.json.get("song_id")
        existing_history_entry = UserHistory.query.filter_by(user_id=user_id, song_id=song_id).first()
        if not existing_history_entry:
            new_history_entry = UserHistory(user_id=user_id, song_id=song_id)
            db.session.add(new_history_entry)
            db.session.commit()

        return jsonify({"message": "Song added to user history."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get-user-rating', methods=['GET'])
def get_user_rating():
    try:
        user_id = request.args.get("user_id")
        song_id = request.args.get("song_id")
        print(user_id)
        print(song_id)
        # Query the database to get the user's rating for the song
        user_rating = UserRating.query.filter_by(user_id=user_id, song_id=song_id).first()

        if user_rating:
            # If a rating exists, return the song_id and the rating
            return jsonify({"song_id": song_id, "rating": user_rating.rating}), 200
        else:
            # If no rating exists, you can return a default value or a specific message
            return jsonify({"message": "User has not rated this song yet."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_user_item_matrix():
    user_ratings = UserRating.query.all()
    user_item_dict = {}

    for rating in user_ratings:
        user_id = rating.user_id
        song_id = rating.song_id
        rating_value = rating.rating

        if user_id not in user_item_dict:
            user_item_dict[user_id] = {}

        user_item_dict[user_id][song_id] = rating_value

    user_item_matrix = pd.DataFrame(user_item_dict).T.fillna(0)

    return user_item_matrix

# Define a function to get collaborative recommendations
def get_collaborative_recommendations(user_id, top_n=10):
    user_item_matrix = create_user_item_matrix()  # Ensure you have the user-item matrix here
    # Calculate user similarity using cosine similarity
    user_similarity = cosine_similarity(user_item_matrix)

    # Find the user's index in the matrix
    user_index = user_item_matrix.index.get_loc(user_id)

    # Calculate the weighted sum of ratings with similar users
    weighted_sum = user_similarity[user_index] @ user_item_matrix.values

    # Exclude items the user has already rated
    user_ratings = user_item_matrix.loc[user_id]
    already_rated = user_ratings[user_ratings > 0].index  # This should return a NumPy array

    # Convert already_rated to a NumPy array with boolean values
    already_rated_indices = user_item_matrix.columns.isin(already_rated)
    weighted_sum[already_rated_indices] = 0

    # Get the indices of the top N recommended songs
    top_indices = weighted_sum.argsort()[::-1][:top_n]

    # Get the song IDs for the top N recommended songs
    top_song_ids = user_item_matrix.columns[top_indices]

    return list(top_song_ids)

@app.route('/collaborative-recommendations', methods=['GET'])
def collaborative_recommendations():
    user_id = request.args.get("user_id")
    top_recommendations = get_collaborative_recommendations(user_id, top_n=15)
    lst=[]
    for i in top_recommendations:
        v=searchForTrack(get_token(),i)
        lst.append(v)
    
    return jsonify({"data": lst}) , 200

if __name__ == '__main__':
	app.run(debug=True)
