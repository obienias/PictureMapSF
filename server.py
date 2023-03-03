"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session,
                    redirect, jsonify)
from model import connect_to_db, db, Photo
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined
from flask import Flask


@app.route("/")
def homepage():

    return render_template('homepage.html')

@app.route("/map")
def view_basic_map():
    """map"""

    return render_template("map.html")

@app.route("/api/markers")
def locations_info():
    """JSON information about bears."""

    photos_info = []
    photos_all = Photo.query.all()
    for photo in photos_all:
        photos_info.append({
            "photo_id": photo.photo_id,
            "title": photo.title,
            "latitude": photo.latitude,
            "longitude": photo.longitude,

        })

    return jsonify(photos_info)


if __name__ == "__main__":

    
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
