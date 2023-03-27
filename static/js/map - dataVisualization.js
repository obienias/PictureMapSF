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
let photoCount;
let photoList;
let hoursList;
let deckOverlay = null;

const ScatterplotLayer = deck.ScatterplotLayer;
const GeoJsonLayer = deck.GeoJsonLayer;
const GoogleMapsOverlay = deck.GoogleMapsOverlay;

start_hour = 3;
finish_hour = 21;

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
valuesSlider.noUiSlider.set(['1', '24']);

valuesSlider.addEventListener('click', function () {
  hoursList = valuesSlider.noUiSlider.get();
  start_hour = hoursList[0];
  finish_hour = hoursList[1];
  console.log(start_hour,finish_hour)
  renderData();
  // console.log(filtered_photos) 
});

function handleValuesSliderClick(Slider, start, end) {
  Slider.addEventListener('click', function () {
    console.log("button clicked")
    valuesSlider.noUiSlider.set([start, end])
    start_hour = start;
    finish_hour = end;
    console.log(start_hour, finish_hour);
    renderData();
    // console.log(filtered_photos);
  });
}

let morning = document.getElementById('button-morning')
handleValuesSliderClick(morning, '5', '13');
let afternoon = document.getElementById('button-afternoon')

handleValuesSliderClick(afternoon,'13', '16');
let evening = document.getElementById('button-evening')

handleValuesSliderClick(evening,'16', '20');
let night = document.getElementById('button-night')

handleValuesSliderClick(night,'20', '24');


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




function renderData() {
  if (deckOverlay){
    deckOverlay.setMap(null)};
  filtered_photos = get_photo_by_hour(start_hour, finish_hour, photos_info);
  console.log(filtered_photos)
  deckOverlay = new GoogleMapsOverlay({
    layers: [
      new ScatterplotLayer({
        id: "photos",
        data: filtered_photos,
        // data: [{rad: 1000, longitude:-122.431297 ,latitude: 37.773972}],
        pickable: true,
        opacity: 0.3,
        stroked: true,
        filled: true,
        pointRadiusScale: 6,
        pickable: true,
        // radiusMinPixels: 1,
        // radiusMaxPixels: 100,
        // lineWidthMinPixels: 1,
        getPosition: d => [d.longitude, d.latitude],
        getRadius: 40,
        getFillColor:  d => {
          if (d.hour_taken < 13) {
            return [255, 166, 0]; // Pink color
          } else if (d.hour_taken < 18) {
            return [239,86,117]; // Blue color
          } else {
            return [0,63,92]; // Blue color
          }},
        // getFillColor:  d => {
        //   if (d.hour_taken < 13) {
        //     return [255, 0, 128]; // Pink color
        //   } else {
        //     return [0, 128, 255]; // Blue color
        //   }
        // },
        // getFillColor:  d => {
        //   if (d.hour_taken < 13) {
        //     return [255, 255, 0]; // Pink color
        //   } else if (d.hour_taken < 16) {
        //     return [128, 0, 128]; // Blue color
        //   } else if (d.hour_taken < 20) {
        //     return [0, 128, 128]; // Blue color
        //   } else {
        //     return [0, 0, 255]; // Blue color
        //   }
        // },

        // getFillColor:  d => {
        //   if (d.hour_taken < 13) {
        //     return [255, 166, 0]; // Pink color
        //   } else if (d.hour_taken < 16) {
        //     return [239,86,117]; // Blue color
        //   } else if (d.hour_taken < 20) {
        //     return [122,81,149]; // Blue color
        //   } else {
        //     return [0,63,92]; // Blue color
        //   }
        // getFillColor:d => [36, 111, 129],
        getLineColor: d => [0, 0, 0],

      }),
    ],
  });
    let props = {
      getTooltip: ({object}) => object && { 
        html:`  <div>
              <div class="photo-thumbnail">
              <img
                src=${object.photo_url2}
                alt="photo-thumbnail"
              />
            </div>
            <div><b>Title:</b> ${object.title}</div>
            <div><b>Author:</b> ${object.author_name}</div>
          </div>`,

          style: {
            backgroundColor: '#fff',
            color: '#333359',
            fontSize: '0.8em',
            borderRadius: '6px',
            padding: '0px 10px 10px 10px'
          }
      }
    };
    deckOverlay.setMap(mapPhoto);
    deckOverlay.setProps(props)
}


function initMap() {
  

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;
      renderData();

    });

  mapPhoto = new google.maps.Map(document.querySelector('#map'), {
    center: sfCoords,
    zoom: 13,
    styles: MAPSTYLES,
    mapTypeControl: false,
    streetViewControl: false,
  });

}

