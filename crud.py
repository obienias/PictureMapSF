""" CRUD Operations"""

from model import db, Photo, Neighbourhood, connect_to_db


def create_photo(photo_id, title, latitude, longitude, time_taken, hour_taken, photo_url, photo_url2, author_id, author_name, photo_url_main):
    photo = Photo(
        photo_id =photo_id, 
        title=title, 
        latitude=latitude, 
        longitude=longitude, 
        time_taken=time_taken, 
        hour_taken=hour_taken, 
        photo_url=photo_url, 
        photo_url2 = photo_url2,
        author_id=author_id, 
        author_name=author_name,
        photo_url_main=photo_url_main
    )

    return photo

def get_photos():
    """Return all photos"""

    return Photo.query.all()

def create_neighbourhoods(name, coordinates, url):
    neighbourhood = Neighbourhood(
        name = name, 
        coordinates = coordinates, 
        url = url
    )

    return neighbourhood

def get_neighbourhoods():
    """Return all neighbourhoods"""

    return Neighbourhood.query.all()

if __name__ == "main":
    from server import app
    connect_to_db(app, echo=False)


