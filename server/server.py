from flask import Flask, render_template
import pickle
import pandas as pd
app = Flask(__name__)

@app.route('/')
def get_data():
    data = df = pd.read_pickle("recommended_songs.pkl")
    print(data)
    return data.to_json()


if __name__ == '__main__':
	app.run(debug=True)
