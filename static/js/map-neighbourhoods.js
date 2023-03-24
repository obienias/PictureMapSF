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

let neighbourhoodPhotoCount = [1, 6, 399, 0, 205, 17, 1, 40, 227, 58, 1619, 56, 35, 15, 19, 123, 420, 349, 755, 101, 624, 36, 8, 14, 92, 65, 63, 84, 88, 83, 110, 2339, 58, 91, 10, 8, 218, 309, 80, 9, 81, 5, 54, 100, 27, 472, 70, 42, 1, 7, 40, 80, 36, 471, 124, 156, 2, 14, 0, 17, 5, 385, 16, 14, 0, 4, 2, 0, 21, 0, 1, 0, 2, 0, 12, 0, 23, 0, 253, 0, 26, 16, 4, 1, 73, 55, 3, 6, 4, 0, 4, 9, 6, 0, 1, 6, 1, 86, 77, 352, 663, 36, 83, 25, 33, 683, 93, 2420, 86, 5, 0, 96, 156, 28, 52, 49, 1]
let maxPhotoCount = Math.max(...neighbourhoodPhotoCount)
let photoCount;
let photoList;


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
  photosByNeighbourhood = []
  for (const photo of filtered_photos) {
    let photoLocation = {
      lat: photo.latitude,
      lng: photo.longitude,
    }
    if (google.maps.geometry.poly.containsLocation(photoLocation, newPolygon)) {
      photosByNeighbourhood.push(photo)
    }
  }   
  console.log (photosByNeighbourhood)
  return photosByNeighbourhood;
}

function getRandomPhotos(numPhotos) {
  let randomPhotos = [];
  let maxIndex = photoList.length - 1;

  for (let i = 0; i < numPhotos; i++) {
    let randomIndex = Math.floor(Math.random() * maxIndex);
    randomPhotos.push(photoList[randomIndex]);
  }
  console.log(randomPhotos);
  return randomPhotos;

}

function displayLightboxGallery(photos) {
  // configure lightbox options as needed
  let options = {};

  // create an array of image URLs for the lightbox
  let imageUrls = photos.map(photo => photo.photo_url);
  console.log(imageUrls)

  // create an array of captions for the lightbox
  let captions = photos.map(photo => photo.title);

  // display the lightbox
  // $.fancybox.open(imageUrls, captions, options);

  let fancyboxItems = photos.map(photo => ({
    src: photo.photo_url,
    thumb: photo.photo_url,
    caption: photo.title
  }));
  
  // display the lightbox
  new Fancybox(
    fancyboxItems,
    {
      hideScrollbar: false,
    }
  );

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

          let index = 0;

          //creates polygins for each neighbourhood  4079829929
          for (const item of neighbourhoods_info) {
            let coords =  JSON.parse(item.coordinates);
            const newPolygon = new google.maps.Polygon({
              title: item.name,
              paths: coords,
              strokeColor: "#FFFFFF",
              strokeOpacity: 0.5,
              strokeWeight: 1,
              fillColor: "#246F81",
              fillOpacity: 0.05,
            });

            //"##c9c9c9"

            //creates instance of neighbourhood on map
            newPolygon.setMap(mapPhoto);

            //appends polygon to list
            polygonList.push(newPolygon);

            //defines content for neighbourhood info-window
            const neighbourhoodInfoContent = `
              <div class="window-content">

                <ul class="neighbourhood-info">
                  <li><b>Neighbourhood name: </b>${item.name}</li>
                  <li><b>Link: </b>${item.url}</li>
                </ul>
              </div>`

            let PolyCenter = newPolygon.getBoundingBox().getCenter();

            const centerMarker = new google.maps.Marker({
              position: PolyCenter,
              visible: false,
              map: mapPhoto,
            })

            photoCount = neighbourhoodPhotoCount[index]
            newPolygon.setOptions({
              fillOpacity: Math.min(0.1 + (photoCount / (maxPhotoCount)*1.4), 0.65),
            });

            index += 1;

            google.maps.event.addListener(newPolygon, 'click', () => {
              neighbourhoodInfo.setContent(neighbourhoodInfoContent);
              neighbourhoodInfo.open(mapPhoto, centerMarker);
              let photos = filterPhotoNeighbourhood (filtered_photos, photosByNeighbourhood, newPolygon);

              photoList = photos;

              let numPhotos = 20; // specify the number of photos to display
              let randomPhotos = getRandomPhotos(numPhotos);
              displayLightboxGallery(randomPhotos);

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

