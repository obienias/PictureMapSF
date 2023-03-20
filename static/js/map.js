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

let hoursList;

start_hour = 0;
finish_hour = 0;

var valuesSlider = document.getElementById('values-slider');
var valuesForSlider = [0,'1 AM',2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]; 

var format = {
    to: function(value) {
        return valuesForSlider[Math.round(value)];
    },
    from: function (value) {
        return valuesForSlider.indexOf(Number(value));
    }
};

noUiSlider.create(valuesSlider, {
    start: [1, 24],
    // A linear range from 0 to 15 (16 values)
    range: { min: 0, max: valuesForSlider.length - 1 },
    // steps of 1
    step: 1,
    tooltips: true,
    format: format,
    pips: { mode: 'steps', 
    // format: format,
    density: 50,

   },
});

// The display values can be used to control the slider
valuesSlider.noUiSlider.set(['1', '24']);

valuesSlider.addEventListener('click', function () {
  hoursList = valuesSlider.noUiSlider.get();
  start_hour = hoursList[0];
  finish_hour = hoursList[1];
  console.log(start_hour,finish_hour)
  displayMarkers();
  console.log(filtered_photos) 
});




// //function to generate dropdown menu for each hour
// function generateDropdownHour(elemnent_id) {

//   const select = document.getElementById(elemnent_id);

//   for (var i = 0; i <= 23; i++) {
//     var option = document.createElement("option");
//     option.text = i + ":00";
//     option.value = i;
//     select.add(option);
//   }
// }

// generateDropdownHour("time_start_dropdown")
// generateDropdownHour("time_end_dropdown")

// const start_dropdown = document.querySelector("#time_start_dropdown");
// const finish_dropdown = document.querySelector("#time_end_dropdown");



// start_dropdown.addEventListener('change', () => {
//   start_hour = start_dropdown.value;
//   console.log("start hour: " + start_hour);
//   displayMarkers();
// });

// finish_dropdown.addEventListener('change', () => {
//   finish_hour = finish_dropdown.value;
//   console.log("finish hour: " + finish_hour);
//   displayMarkers();
// });

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

function deleteMarkers() {

  for (const marker of all_markers) {
    marker.setMap(null)
  }
  all_markers = [];

};

function displayMarkers() {

  //clears the markers
  deleteMarkers();

  //clears the merker clusters
  if (MarkerClusters) {
    MarkerClusters.clearMarkers();
  }

  //loops over filtered_photos and create markers, information for info-window 
  filtered_photos = get_photo_by_hour(start_hour, finish_hour, photos_info);
  // console.log(filtered_photos);
  for (const photo of filtered_photos) {

    // Define the content of the infoWindow
    const photoInfoContent = `
    <div class="window-content">
      <div class="photo-thumbnail">
        <img
          src=${photo.photo_url}
          alt="photo-thumbnail"
        />
      </div>

      <ul class="photo-info">
        <li><b>Photo title: </b>${photo.title}</li>
        <li><b>Author name: </b>${photo.author_name}</li>
        <li><b>Date: </b>${photo.time_taken}</li>
      </ul>
    </div>`


    const photoMarker = new google.maps.Marker({
      position: {
        lat: photo.latitude,
        lng: photo.longitude,
      },
      title: `Photo title: ${photo.title}`,
      icon: {
        url: '/static/img/marker_color.png',
        scaledSize: {
          width: 20,
          height: 20,
        }
      },
      optimized: true,
      map: mapPhoto,
    })
    all_markers.push(photoMarker);

    photoMarker.addListener('click', () => {
      photoInfo.close();
      photoInfo.setContent(photoInfoContent);
      photoInfo.open(map, photoMarker);
    });

    
  }

    countTotal = all_markers.length
    const maxDim= 200;
    const minDim = 30;
    const k = 5;
    const x = 0.35;


    const renderer = {
    render: ({ count, position }, stats) =>

      new google.maps.Marker({
      label: { text: String(count), color: "#FFFFFF", fontSize: "12px", fontWeight: "600" },
      // icon: {
      //     url: '/static/img/m1.png',
      //     // scaledSize: new google.maps.Size(((maxDim - minDim) / (1 + Math.exp(-k*(count/stats.clusters.markers.max - x))) + minDim),((maxDim - minDim) / (1 + Math.exp(-k*(count/stats.clusters.markers.max - x))) + minDim)),
      //     scaledSize: new google.maps.Size((40+(count/stats.clusters.markers.max)*50),(40+(count/stats.clusters.markers.max)*50))
      //   },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: (15+(count/stats.clusters.markers.max)*25),
        fillColor: "#BD3F16",
        //246F81, 56d4ee, 04bceb, 244047, e57f84, 246F81, 6592A0
        fillOpacity: 0.7,
        strokeWeight: 0
      },
      position,
      // adjust zIndex to be above other markers
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      })

    };

    MarkerClusters = new markerClusterer.MarkerClusterer({map: mapPhoto, markers: all_markers, renderer});

}



function initMap() {
  

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;

      photoInfo = new google.maps.InfoWindow();
     
      displayMarkers();
           

    });

  mapPhoto = new google.maps.Map(document.querySelector('#map'), {
    center: sfCoords,
    zoom: 13,
    styles: MAPSTYLES,
    mapTypeControl: false,
    streetViewControl: false,
  });

}

