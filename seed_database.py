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

# Load photo data from JSON file
with open("data/photos_all2.json") as f:
    photo_data = json.loads(f.read())

# Create photos, store them in list so we can use them
photos_in_db = []
for photo in photo_data:
    photo_id, title, latitude, longitude, time_taken, hour_taken, photo_url, author_id, author_name = (
        photo["photo_id"],
        photo["title"],
        photo["latitude"],
        photo["longitude"],
        photo["time_taken"],
        photo["hour_taken"],
        photo["photo_url"],
        photo["author_id"],
        photo["author_name"],
        
    )
    
    new_photo = crud.create_photo(photo_id=photo_id, title=title, latitude=latitude, longitude=longitude, 
    time_taken=time_taken, hour_taken=hour_taken, photo_url=photo_url, author_id=author_id, author_name=author_name)
    photos_in_db.append(new_photo)

with open("data/SF Find Neighborhoods.geojson") as f:
    neighbourhoods_data = json.loads(f.read())

neighbourhoods_in_db = []
for neighbourhood in neighbourhoods_data:
    id, name, coordinates, url= (
        neighbourhood["id"],
        neighbourhood["name"],
        neighbourhood["coordinates"],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        neighbourhood["url"],
        
    )

model.db.session.add_all(photos_in_db)
model.db.session.add_all(photos_in_db)
model.db.session.commit()



        

