"""Server for movie ratings app."""

from flask import (Flask, render_template, request, flash, session,
                    redirect, jsonify)
from model import connect_to_db, db, Photo, Neighbourhood
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
    """photo map"""

    return render_template("map.html")

@app.route("/map-neighbourhoods")
def view_neighbourhoods_map():
    """neighbourhoods map"""

    return render_template("map-neighbourhoods.html")

@app.route("/map-data-visualization")
def view_data_visualization_map():
    """data visualization map"""

    return render_template("map - visualization.html")

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
            "hour_taken" : photo.hour_taken,
            "photo_url": photo.photo_url,
            "photo_url2": photo.photo_url2,
            "author_name": photo.author_name,
            "time_taken": photo.time_taken,
            "photo_url_main": photo.photo_url_main
        })

    return jsonify(photos_info)

@app.route("/api/neighbourhoods")
def neighbourhoods_info():
    """JSON information about neighbourhoods."""

    neighbourhoods_info = []
    neighbourhoods_all = crud.get_neighbourhoods()
    for neighbourhood in neighbourhoods_all:
        neighbourhoods_info.append({
            "id": neighbourhood.id,
            "name": neighbourhood.name,
            "coordinates": neighbourhood.coordinates,
            "url": neighbourhood.url,

        })

    return jsonify(neighbourhoods_info)


if __name__ == "__main__":

    
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=False)
