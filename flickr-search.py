"""APIs and Requests Library: Flickr API"""


import flickrapi
import json
from datetime import datetime, timedelta
import time

# Authenticate with the Flickr API
api_key = 'ed2411aa3b94c9e88fb92c87734c5707'
api_secret = '92a19733fabd0248'
flickr = flickrapi.FlickrAPI(api_key, api_secret, format='parsed-json')

# Specify the search parameters
search_query = {
    'lat': '37.773972',
    'lon': '-122.4194',
    'radius': '12',
    'min_taken_date': '2023-02-01',
    'max_taken_date': '2023-05-31',
    'page': 1,
    'per_page': 500,
}

# date initialisation - start and end date
start_date = datetime(2022, 3, 1)
end_date = datetime(2022, 5, 31)
 
# define time deltas and output date format
add_two_days = timedelta(days=2)
add_day = timedelta(days=1)
date_format = '%Y-%m-%d'

#create empty list to append photos
results = []

# itearte from start to end date
while start_date <= end_date:
    second_date = start_date + add_day
    # print(start_date.strftime(date_format))
    # print(second_date.strftime(date_format))
    min_date = start_date.strftime(date_format)
    max_date = second_date.strftime(date_format)

    search_query['min_taken_date'] = min_date  # set min taken date 
    search_query['max_taken_date'] = max_date  # set max taken date 

    # Search for photos that match the specified parameters
    results_first = flickr.photos.search(**search_query)

    # print (results_first)
    # print (len(results['photos']['photo']))

    #gets total number of pages returned by API
    num_pages_total = results_first['photos']['pages']

    #checks if the number of pages == 0 or more 
    if num_pages_total == 1:
        for photo in results_first['photos']['photo']:
            photo_data = {
                'id' : photo['id'],
                'secret' : photo['secret']
            }
            results.append(photo_data)
    elif num_pages_total > 1:
        #loop over paginated API
        for page_current in range(1, num_pages_total + 1):
            search_query['page'] = page_current  # set the current page number
            response = flickr.photos.search(**search_query)  # make the API request
            for photo in response['photos']['photo']:
                photo_data = {
                    'id' : photo['id'],
                    'secret' : photo['secret'],
                    'farm' : photo['farm'],
                    'server' : photo['server']
                }
                results.append(photo_data)

    # add 2 days to current date
    start_date += add_two_days

# print (len(results))

# # # export photo id and secret to JSON file
# # with open("data/photos_id.json", 'w') as f:
# #     json.dump(results, f)


# # Load photo data from JSON file
# with open("data/photos_id.json") as f:
#     results = json.loads(f.read())


# print (results)
# print (num_pages_total)

#sets new dictionary and list to contain photo info
photo_list = []

#loops over results of search query
number = 0

for photo in results:
    #handle errors in the loop, print message and continue to the next one
    try:
        photo_info = flickr.photos.getInfo(photo_id=photo['id'], secret=photo['secret'])

        #retrieve parameters using get method
        photo_id = int(photo.get('id'))
        server = photo.get('server')
        title = photo_info['photo']['title']['_content']
        latitude = float(photo_info['photo']['location'].get('latitude'))
        longitude = float(photo_info['photo']['location'].get('longitude'))
        time_taken = photo_info['photo']['dates'].get('taken')
        hour_taken = int(time_taken.split()[-1].split(':')[0])
        photo_url = f"https://farm{photo.get('farm')}.staticflickr.com/{photo.get('server')}/{photo.get('id')}_{photo.get('secret')}.jpg"
        photo_url2 = f"https://live.statick.flickr.com/{photo.get('server')}/{photo.get('id')}_{photo.get('secret')}.jpg"]"
        author_name = photo_info['photo']['owner'].get('nsid')
        author_id = photo_info['photo']['owner'].get('username')
        photo_url_main = f"https://www.flickr.com/photos/{author_id}/{photo.get('id')}"
        # author_profile_url = 1
        # tags = photo_info['photo'].get('tags')

        # Add photo information to dictionary
        photo_dict = {
            'photo_id': photo_id,
            'title': title,
            'server': server
            'latitude': latitude,
            'longitude': longitude,
            'time_taken': time_taken,
            'hour_taken': hour_taken,
            'photo_url': photo_url,
            'author_id': author_id,
            'author_name': author_name,
            'photo_url2' : photo_url2
            'photo_url_main' : photo_url_main

        }

        photo_list.append(photo_dict)

    except:
        print("an error occured")

    number += 1
    if number % 100 == 0:
        time.sleep(20)

    print (number)
#     # print(photo_info)
#     # print (photo)



# print (photo_list)
print (number)

# photo_set = set(photo_list)
# print(len(photo_set))

with open("data/photosA - Copy (5).json", 'w') as f:
    json.dump(photo_list, f)

