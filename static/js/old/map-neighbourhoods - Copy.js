'use strict';


let photos_info;
let all_markers = [];
let MarkerClusters = null;
let mapPhoto; 
let photoInfo;
let neighbourhoods_info;
let polygonList = []
let photosByNeighbourhood = []
let filtered_photos
let neighbourhoodInfo
const sfCoords = {
  lat: 37.773972,
  lng: -122.431297,
};
let countTotal;
let count;
let start_hour;
let finish_hour;

let minRange;
let maxRange;
let photoCountList =[];



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

const start_dropdown = document.querySelector("#time_start_dropdown");
const finish_dropdown = document.querySelector("#time_end_dropdown");

start_hour = 0;
finish_hour = 0;

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

// Filter the photos based on the time of day
function get_photo_by_hour(start, end, photos_info) {
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

// function deleteMarkers() {

//   for (const marker of all_markers) {
//     marker.setMap(null)
//   }
//   all_markers = [];

// };



// function displayNeighbourhoods() {

// }



function filterPhotoNeighbourhood (filtered_photos, photosByNeighbourhood, newPolygon) {
  for (const photo of filtered_photos) {
    let photoLocation = {
      lat: photo.latitude,
      lng: photo.longitude,
    }
    if (google.maps.geometry.poly.containsLocation(photoLocation, newPolygon)) {
      photosByNeighbourhood.push(photo)
    }
  }   
  // console.log (photosByNeighbourhood)
  return photosByNeighbourhood;
}

function initMap() {
  

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;
      filtered_photos = get_photo_by_hour(start_hour, finish_hour, photos_info);
      let photoCountTotal = filtered_photos.length;
      console.log (photoCountTotal);


      fetch('/api/neighbourhoods')
        .then((response) => response.json())
        .then((responseData2) => {

          neighbourhoods_info = responseData2;
          // console.log(neighbourhoods_info);
          
          //creates one instance of info window for neighbourhoods
          neighbourhoodInfo = new google.maps.InfoWindow();

          //defines bounding box for polygons (non-native in google maps API)
          google.maps.Polygon.prototype.getBoundingBox = function() {
            var bounds = new google.maps.LatLngBounds();
          
            this.getPath().forEach(function(element,index) {
              bounds.extend(element)
            });
            return(bounds);
          };

          //creates polygins for each neighbourhood
          for (const item of neighbourhoods_info) {
            let coords =  JSON.parse(item.coordinates);
            const newPolygon = new google.maps.Polygon({
              title: item.name,
              paths: coords,
              strokeColor: "##c9c9c9",
              strokeOpacity: 0.3,
              strokeWeight: 1,
              fillColor: "##c9c9c9",
              fillOpacity: 0.05,
            });

            //creates instance of neighbourhood on map
            newPolygon.setMap(mapPhoto);

            //appends polygon to list
            polygonList.push(newPolygon);

            //defines content for neighbourhood info-window


            let photoCount = filterPhotoNeighbourhood (filtered_photos, photosByNeighbourhood, newPolygon).length;

            photoCountList.push(photoCount)
            // newPolygon.setOptions({
            //   fillOpacity: Math.min(0.1 + (photoCount / (photoCountTotal))*2, 0.7),
            // });

            google.maps.event.addListener(newPolygon, 'click', () => {
              neighbourhoodInfo.setContent(neighbourhoodInfoContent);
              neighbourhoodInfo.open(mapPhoto, centerMarker);
              let photos = filterPhotoNeighbourhood (filtered_photos, photosByNeighbourhood, newPolygon);

              // mapPhoto.centerObject(newPolygon);
            });
            
          }

           // displayNeighbourhoods()        

        });
    

    });

  mapPhoto = new google.maps.Map(document.querySelector('#map'), {
    center: sfCoords,
    zoom: 13,
    styles: MAPSTYLES,
    mapTypeControl: false,
    streetViewControl: false,
  });

}

