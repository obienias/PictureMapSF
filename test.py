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


  """ #1
Python programmers write variable names in snake case, where each word is lowercase and joined by underscores. For example, if you were to write “very hungry caterpillar” in snake case, you’d write very_hungry_caterpillar.

JavaScript programmers write variable names in camel case, where the initial word is lowercase and other words are capitalized. For example, if you were to write “very hungry caterpillar” in camel case you’d write veryHungryCaterpillar.

Write a function that converts a string in snake case to a string in camel case.

example: 
function("very_hungry_caterpillar")
returns: "veryHungryCaterpillar"
"""

#define a function that takes string argument in camel case and returns string in snake case
#define variable empty string for snake case
# iterate through the given string
# if char == _ - do not add this char to new string, convert the next char to upper case
# return the string

def convert_to_camel_case (string_snake_case):
    string_camel_caseA = ""
    string_camel_caseB = ""
    indices_list = []
    count = 0
    
    for char in string_snake_case:
        if char == "_":
            indices_list.append(count+1)
        else:
            string_camel_caseA += char
        count += 1
        
    string_camel_caseB = list(string_camel_caseA)
    
    for item in indices_list:
        string_camel_caseB[item] = string_camel_caseA[item].upper()

    finalString = "".join(string_camel_caseB)
    
    return finalString 


def snake_cc(phrase):
    
    new_str = ""
    x = 0
    
    for i, char in enumerate(phrase):
        if i == 0:
            new_str += char
        else:
            if x == 1:
                new_str += char.upper()
                x = 0
            else:
                if char == "_":
                    x = 1
                else:
                    new_str += char
                    
    return new_str
        

def snake_to_camel(string):
    
    camelStr = ""
    split_str = string.split("_")
    ["very", "hungry", "caterpillar"]
    
    for i, word in enumerate(split_str):
        if i == 0:
            camelStr += word
        else:
            camelStr += word.title()
    
    return camelStr
            
            
def june_to_camel(phrase):
    
    snake_list = phrase.split('_')
    camel = snake_list[0]
    
    for i in range(1, (len(snake_list))):
        camel += snake_list[i].title()
        
    return camel



""" #2
Write a function that takes in a phrase and returns a dictionary that can be used to lookup words by word lengths.

For example, the phrase ("cute cats chase funny rats") should return a dictionary like so:

{
    4: {"cute", "cats", "rats"},
    5: {"chase", "funny"}
}
Notice that the keys of the dictionary above are integers and its values are sets that contain strings.
"""


# start w/ empty dictionary
# split the string on the spaces into list
# iterate over the list to get lengths of each word 
# check dictionary for the length 
# if not in dict, add new set to the dictionary with word
# if in dict, add word to that set

def make_word_length_dict(dict_str):
    words_by_length = {}

    word_list = dict_str.split()

    for word in word_list:
        word_length = len(word)

        if words_by_length.get(word_length):
            words_by_length[word_length].add(word)
        else:
            words_by_length[word_length] = {word, }

    return words_by_length


def letter_count_dict(phrase):
    
    letter_counts = {}
    
    for word in phrase.split(" "):
        
        if len(word) not in letter_counts:
            
            letter_counts[len(word)] = set()
        
        letter_counts[len(word)].add(word)
        
    return letter_counts

def erin_letter_dict(phrase):
    
    split_phrase = phrase.split()
    words_by_length = {}
    
    for word in split_phrase:
        
        length = len(word)
        words_by_length[length] = (words_by_length.get(length, set(word))).add(word)
    
    return words_by_length


""" #3
Write a function that takes in a list and reverses it in-place (without creating a new list).

Hint:
To swap two values, you can use this syntax:
a, b = b, a

ex:
l1 = [1,2,3,4,5]

function(l1)

l1 
>>> [5,4,3,2,1]
"""

# define function that takes in list
# reverse this list in place 
# returns a list

def reverse_list (given_list):

    # given_list[0:] = given_list[::-1]

    for i in range(len(given_list) // 2):
        
        given_list[i], given_list[-(i + 1)] = given_list[-(i + 1)], given_list[i]

    return given_list

    
def rev_list_in_place(lst):
    
    for idx in range(len(lst) // 2):

        idx1, idx2 = idx, -(idx + 1)

        lst[idx1], lst[idx2] = lst[idx2], lst[idx1]
    
    return lst


""" #4
Write a function that takes in two strings and returns True if the strings are anagrams of one another. For example,

"moon", "noom" => True
"bat", "snack" => False
"", "" => True
"""






""" #5
Write a function that prints an encrypted message.

Using this method, the message HOT SAUCE would look like this:

HTAC
OSUE
It’s a pretty simplistic method of encryption. All you do is split the letters of the initial message and alternate them over two rows of text, skipping any spaces. For example, the first letter goes in the first row, the second letter goes in the second row, the third letter goes in the first row, and so on…

Write a function that takes in a phrase and prints an encrypted version of that phrase using the method described above.

The phrase is guaranteed to only contain uppercase, alphabetic characters and spaces.
"""
