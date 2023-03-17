# import os
# import json
# # from random import choice, randint
# from datetime import datetime

# import crud
# import model
# import server


# def flatten_list(nlist):
#   return [item for sublist in nlist for item in sublist] 

# with open("data/SF Find Neighborhoods.geojson") as f:
#     neighbourhoods_data = json.loads(f.read())

# neighbourhoods_in_db = []
# for neighbourhood in neighbourhoods_data["features"]:
#     nested_coordinates = neighbourhood["geometry"]["coordinates"]
#     flat_coords = flatten_list(nested_coordinates)
#     flat_coords = flatten_list(flat_coords)

#     # Convert coordinates to desired format per google maps api
#     coordinates = [{"lat": coord[1], "lng": coord[0]} for coord in flat_coords]
#     print (coordinates)
#     name = neighbourhood["properties"]["name"] 
#     print (name)
#     url= neighbourhood["properties"]["link"]
#     print (url)

#     new_neighbourhood = crud.create_neighbourhoods(name, coordinates, url)
#     neighbourhoods_in_db.append(new_neighbourhood)

#     print (new_neighbourhood)


def function_dict(string):
  list_words = []
  list_words = string.split()

  new_dict = {}

  for word in list_words:
    length = len(word)
    if length in new_dict:
      new_dict[length].append(word)
    else:
      new_dict[length] = [word]
  return new_dict
