"""APIs and Requests Library: Flickr API"""


# import requests

import flickrapi
import json

# Authenticate with the Flickr API
api_key = 'ed2411aa3b94c9e88fb92c87734c5707'
api_secret = '92a19733fabd0248'
flickr = flickrapi.FlickrAPI(api_key, api_secret, format='parsed-json')

# Specify the search parameters
search_query = {
    'lat': '37.773972',
    'lon': '-122.4194',
    'radius': '12',
    'min_upload_date': '2023-02-17',
    'max_upload_date': '2023-02-20',
    'page': 1,
}

#handle differently if page = 1 and if more??

# Search for photos that match the specified parameters
results_first = flickr.photos.search(**search_query)

print (results_first)
# print (len(results['photos']['photo']))

#gets total number of pages returned by API
num_pages_total = results_first['photos']['pages']

results = []

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
                'secret' : photo['secret']
            }
            results.append(photo_data)

# print (results)
# print (num_pages_total)

#sets new dictionary and list to contain photo info
photo_list = []

#loops over results of search query
number = 0

for photo in results:

    photo_info = flickr.photos.getInfo(photo_id=photo['id'], secret=photo['secret'])

    #retrieve parameters using get method
    photo_id = int(photo.get('id'))
    title = photo_info['photo']['title']['_content']
    latitude = float(photo_info['photo']['location'].get('latitude'))
    longitude = float(photo_info['photo']['location'].get('longitude'))
    time_taken = photo_info['photo']['dates'].get('taken')
    hour_taken = int(time_taken.split()[-1].split(':')[0])
    photo_url = f"https://farm{photo.get('farm')}.staticflickr.com/{photo.get('server')}/{photo.get('id')}_{photo.get('secret')}.jpg"
    author_id = photo_info['photo']['owner'].get('nsid')
    author_name = photo_info['photo']['owner'].get('username')
    # author_profile_url = 1
    # tags = photo_info['photo'].get('tags')

     # Add photo information to dictionary
    photo_dict = {
        'photo_id': photo_id,
        'title': title,
        'latitude': latitude,
        'longitude': longitude,
        'time_taken': time_taken,
        'hour_taken': hour_taken,
        'photo_url': photo_url,
        'author_id': author_id,
        'author_name': author_name
    }

    photo_list.append(photo_dict)

    number += 1
    print (number)
#     # print(photo_info)
#     # print (photo)



# print (photo_list)
print (number)

# photo_set = set(photo_list)
# print(len(photo_set))

with open("data/photos.json", 'w') as f:
    json.dump(photo_list, f)

