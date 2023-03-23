from shapely.geometry import Point, Polygon
import model
from model import connect_to_db, db, Photo, Neighbourhood
import crud
import server
import json

model.connect_to_db(server.app)

photos_all = crud.get_photos()

neighbourhoods_all = crud.get_neighbourhoods()

photoLocationList = []
polygonList = []

for photo in photos_all:
    photoLocation = Point(photo.latitude, photo.longitude)
    photoLocationList.append(photoLocation)
# print (photoLocationList)

for poly in neighbourhoods_all:
    
    poly_coords = json.loads(poly.coordinates)
    # print (poly_coords)
    polygon_coords = []

# Iterate over the list of dictionaries and extract the latitude and longitude values
    for coord in poly_coords:
        # coord = json.loads(coord)
        lat = coord['lat']
        lon = coord['lng']
        # Append the latitude and longitude values as a tuple to the new list
        polygon_coords.append((lat, lon))
    # print(polygon_coords)
    polygon = Polygon(polygon_coords)
    polygonList.append(polygon)

# print (polygonList)

neighbourhoodPhotoCount = []


# x=0
# for item in polygonList:
    
#     for point in photoLocationList:
#         if polygon.contains(point):
#             x+=1
#             print (x)
#     neighbourhoodPhotoCount.append(x)


for polygon in polygonList:
    count = 0
    for photoLocation in photoLocationList:
        if polygon.contains(photoLocation):
            count += 1
    neighbourhoodPhotoCount.append(count)




print (neighbourhoodPhotoCount)

