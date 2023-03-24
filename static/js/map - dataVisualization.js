'use strict';


let photos_info;
let all_markers = [];
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
// let maxPhotoCount = Math.max(...neighbourhoodPhotoCount)
let photoCount;
let photoList;
let hoursList;

const ScatterplotLayer = deck.ScatterplotLayer;
const GeoJsonLayer = deck.GeoJsonLayer;
const GoogleMapsOverlay = deck.GoogleMapsOverlay;

start_hour = 1;
finish_hour = 24;

var valuesSlider = document.getElementById('values-slider');
var valuesForSlider = [0,'1 AM','2AM','3AM','4AM','5AM','6AM',7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]; 

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
    // format: format,
    pips: { mode: 'steps', 
    // format: format,
    density: 50,

   },
});

// The display values can be used to control the slider
valuesSlider.noUiSlider.set(['5', '12']);

valuesSlider.addEventListener('click', function () {
  hoursList = valuesSlider.noUiSlider.get();
  start_hour = hoursList[0];
  finish_hour = hoursList[1];
  console.log(start_hour,finish_hour)
  get_photo_by_hour(start_hour, finish_hour, photos_info);
  // console.log(filtered_photos) 
});

function handleValuesSliderClick(Slider, start, end) {
  Slider.addEventListener('click', function () {
    console.log("button clicked")
    valuesSlider.noUiSlider.set([start, end])
    start_hour = start;
    finish_hour = end;
    console.log(start_hour, finish_hour);
    get_photo_by_hour(start_hour, finish_hour, photos_info);
    // console.log(filtered_photos);
  });
}

let morning = document.getElementById('button-morning')
handleValuesSliderClick(morning, '5', '12');
let afternoon = document.getElementById('button-afternoon')

handleValuesSliderClick(afternoon,'12', '17');
let evening = document.getElementById('button-evening')

handleValuesSliderClick(evening,'17', '21');
let night = document.getElementById('button-night')

handleValuesSliderClick(night,'21', '24');


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



function initMap() {
  

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;
      filtered_photos = get_photo_by_hour(start_hour, finish_hour, photos_info);
      // let photoCountTotal = filtered_photos.length;
      // console.log (photoCountTotal);

      // const deckOverlay = new GoogleMapsOverlay({
      //   layers: [
      //     new GeoJsonLayer({
      //       id: "earthquakes",
      //       data: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
      //       filled: true,
      //       pointRadiusMinPixels: 2,
      //       pointRadiusMaxPixels: 200,
      //       opacity: 0.4,
      //       pointRadiusScale: 0.3,
      //       getRadius: (f) => Math.pow(10, f.properties.mag),
      //       getFillColor: [255, 70, 30, 180],
      //       autoHighlight: true,
      //       // transitions: {
      //       //   getRadius: {
      //       //     type: "spring",
      //       //     stiffness: 0.1,
      //       //     damping: 0.15,
      //       //     enter: () => [0],
      //       //     duration: 10000,
      //       //   },
      //       // },
      //       // onDataLoad: () => {
      //       //   /* eslint-disable no-undef */
      //       //   // @ts-ignore defined in include
      //       //   progress.done(); // hides progress bar
      //       //   /* eslint-enable no-undef */
      //       // },
      //     }),
      //   ],
      // });
    
      // deckOverlay.setMap(mapPhoto);

      const deckOverlay = new GoogleMapsOverlay({
        layers: [
          new ScatterplotLayer({
            id: "photos",
            data: filtered_photos,
            // data: [{rad: 1000, longitude:-122.431297 ,latitude: 37.773972}],
            pickable: true,
            opacity: 0.4,
            stroked: true,
            filled: true,
            pointRadiusScale: 6,
            // radiusMinPixels: 1,
            // radiusMaxPixels: 100,
            // lineWidthMinPixels: 1,
            getPosition: d => [d.longitude, d.latitude],
            getRadius: 60,
            getFillColor: d => [36, 111, 129],
            getLineColor: d => [0, 0, 0]

          }),
        ],
      });

      console.log("cccc")
      deckOverlay.setMap(mapPhoto);

    });

  mapPhoto = new google.maps.Map(document.querySelector('#map'), {
    center: sfCoords,
    zoom: 13,
    styles: MAPSTYLES,
    mapTypeControl: false,
    streetViewControl: false,
  });

}

