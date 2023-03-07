'use strict';

//function to generate dropdown menu for each hour
function generateDropdownHour(elemnent_id) {

  const select = document.getElementById(elemnent_id);

  for (var i = 0; i <= 23; i++) {
    var option = document.createElement("option");
    option.text = i + ":00";
    option.value = i;
    select.add(option);
  }
}

generateDropdownHour("time_start_dropdown")
generateDropdownHour("time_end_dropdown")

// Filter the photos based on the time of day
function get_photo_by_hour (start, end, photos_info) {
  let filtered_photos = [];
  if (start === 0 || end === 0) {
    return photos_info;
  }
  for (let photo of photos_info) {
    if (photo.hour_taken >= start && photo.hour_taken < end) {
      filtered_photos.push(photo)
    
    }
  }
  return filtered_photos
}



function initMap() {
  const sfCoords = {
    lat: 37.773972,
    lng: -122.431297,
  };


  fetch('/api/markers')
    .then((response) => response.json())
    .then((photos_info) => {
      console.log(photos_info);

      const start_dropdown = document.querySelector("#time_start_dropdown");
      const finish_dropdown = document.querySelector("#time_end_dropdown");

      let start_hour = 0;
      let finish_hour = 0;

      start_dropdown.addEventListener('change', () => {
        start_hour = start_dropdown.value;
        console.log("start hour: " + start_hour);
        displayMarkers();
      });

      finish_dropdown.addEventListener('change', () => {
        finish_hour = finish_dropdown.value;
        console.log("finish hour: " + finish_hour);
        displayMarkers();
      });

      let all_markers = [];

      function deleteMarkers() {

        for (const marker of all_markers) {
          marker.setMap(null)
        }
        all_markers = [];
      }

      function displayMarkers() {
        deleteMarkers();
        const filtered_photos = get_photo_by_hour(start_hour, finish_hour, photos_info);
        console.log(filtered_photos);
        for (const location of filtered_photos) {
          const photoMarker = new google.maps.Marker({
            position: {
              lat: location.latitude,
              lng: location.longitude,
            },
            title: `Photo title: ${location.title}`,
            icon: {
              url: '/static/img/marker.svg',
              scaledSize: {
                width: 15,
                height: 15,
              }
            },
            map: map,
          })
          all_markers.push(photoMarker);
        }
      }

      displayMarkers();
    })
    const map = new google.maps.Map(document.querySelector('#map'), {
          center: sfCoords,
          zoom: 12,
        });
}

