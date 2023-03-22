import os
import json
# from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system("dropdb photos")
os.system("createdb photos")

model.connect_to_db(server.app)
model.db.create_all()

# Load photo data from JSON file_data
with open("data/photosA_all.json") as f:
    photo_data = json.loads(f.read())

# Create photos, store them in list so we can use them
photos_in_db = []
for photo in photo_data:
    photo_id, title, latitude, longitude, time_taken, hour_taken, photo_url, author_id, author_name, photo_url_main = (
        photo["photo_id"],
        photo["title"],
        photo["latitude"],
        photo["longitude"],
        photo["time_taken"],
        photo["hour_taken"],
        photo["photo_url"],
        photo["author_id"],
        photo["author_name"],
        photo["photo_url_main"],
        
    )
    
    new_photo = crud.create_photo(photo_id=photo_id, title=title, latitude=latitude, longitude=longitude, 
    time_taken=time_taken, hour_taken=hour_taken, photo_url=photo_url, author_id=author_id, author_name=author_name, photo_url_main=photo_url_main)
    photos_in_db.append(new_photo)


def flatten_list(nlist):
  return [item for sublist in nlist for item in sublist]    

with open("data/SF Find Neighborhoods.geojson") as f:
    neighbourhoods_data = json.loads(f.read())

neighbourhoods_in_db = []
for neighbourhood in neighbourhoods_data["features"]:
    nested_coordinates = neighbourhood["geometry"]["coordinates"]
    flat_coords = flatten_list(nested_coordinates)
    flat_coords = flatten_list(flat_coords)

    # Convert coordinates to desired format per google maps api
    coordinates = [{"lat": coord[1], "lng": coord[0]} for coord in flat_coords]
    coordinates = json.dumps(coordinates)
    name = neighbourhood["properties"]["name"] 
    url= neighbourhood["properties"]["link"]

    new_neighbourhood = crud.create_neighbourhoods(name, coordinates, url)
    neighbourhoods_in_db.append(new_neighbourhood)

model.db.session.add_all(photos_in_db)
model.db.session.add_all(neighbourhoods_in_db)
model.db.session.commit()



        

