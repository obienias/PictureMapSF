"""removes repeated photos from json file"""

#still need to fix this script to not create list of lists

import json

# list_files = ["data/photosA.json", "data/photosA - Copy.json","data/photosA - Copy (2).json","data/photosA - Copy (3).json",
# "data/photosA - Copy (4).json","data/photosA - Copy (5).json"]

list_files = ["data/photosA_all.json"]


photos_list = []

for item in list_files:

    with open(item) as f:
        photo_data = json.loads(f.read())


    for d in photo_data:
        url = d['photo_url']
        start = url.find('_') + 1  # find the index of the underscore and add 1 to get the start of the number
        end = url.find('.jpg')  # find the index of the ".jpg"

        secret = url[start:end]  # extract the number using slicing 
        d['photo_url2'] = f"https://live.staticflickr.com/65535/{d['photo_id']}_{secret}_b.jpg"
        d['photo_url_main'] = f"https://www.flickr.com/photos/{d['author_id']}/{d['photo_id']}"

    # print (len(photo_data))

    # Convert each dictionary to a tuple of key-value pairs
    list_of_tuples = [tuple(d.items()) for d in photo_data]

    # Eliminate duplicates by converting the list to a set and then back to a list
    unique_tuples = list(set(list_of_tuples))

    # print (unique_tuples)

    # Convert each tuple back to a dictionary
    photos_list_current = [dict(t) for t in unique_tuples]

    photos_list.append(photos_list_current)




# print (photos_list)
# print (len(photos_list))

with open("data/photosA_all-all.json", 'w') as f:
    json.dump(photos_list, f)



#(('photo_id', 52634209259), ('title', ''), ('latitude', 37.793358), ('longitude', -122.406084), 
# ('time_taken', '2023-01-07 16:11:26'), ('hour_taken', 16), ('photo_url', 'https://farm66.staticflickr.com/65535/52634209259_ea5b5229b7.jpg'), 
# ('author_id', '74877815@N05'), ('author_name', 'matthew valencia'))
# https://www.flickr.com/photos/96698945@N00/52092687520  
# https://live.staticflickr.com/65535/52287964452_9a4c21ff4b_b.jpg 

# for touples in unique_tuples:
#     for item in touples:



