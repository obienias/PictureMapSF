"""Models for movie ratings app."""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Photo(db.Model):

    __tablename__ = "photos"

    photo_id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    time_taken = db.Column(db.String)
    hour_taken = db.Column(db.Integer)
    photo_url = db.Column(db.String)
    author_id = db.Column(db.String(50))
    author_name = db.Column(db.String(50))


    def __repr__(self):
        return f"<photo_id = {self.photo_id} and title = {self.title}>"

class Neighbourhood(db.Model):

    __tablename__ = "neighbourhoods"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    coordinates = db.Column(db.String)
    url = db.Column(db.String)

    def __repr__(self):
        return f"<neighbourhood_name = {self.name}>"

def connect_to_db(flask_app, db_uri="postgresql:///photos", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo  #false
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")

if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
