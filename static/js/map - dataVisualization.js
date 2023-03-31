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
var valuesForSlider = [0, '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];

var format = {
  to: function (value) {
    return valuesForSlider[Math.round(value)];
  },
  from: function (value) {
    return valuesForSlider.indexOf(value);
  }
};

function filterPips(value, type) {
  if (type === 0) {
    return value < 2000 ? -1 : 0;
  }
  if (value % 2 === 0) {
    return 1; // large pip
  }
  return 0; // small pip
}

noUiSlider.create(valuesSlider, {
  start: ['1 AM', '11 PM'],
  range: { min: 0, max: valuesForSlider.length - 1 },
  // steps of 1
  step: 1,
  tooltips: false,
  connect: true,
  // format: format,
  pips: {
    mode: 'steps',
    format: format,
    filter: filterPips,
    // density: 50,
    // values:4
    classes: {
      // class for small pip
      '0': 'noUi-small-pip',
      // class for large pip
      '1': 'noUi-large-pip'
    }
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

function animateTimePeriods() {
  console.log("animation clicked");

  setTimeout(function() {
    valuesSlider.noUiSlider.set(['5', '13'])
    start_hour = '5';
    finish_hour = '13';
    console.log(start_hour, finish_hour);
    renderData();
  }, 0);

  setTimeout(function() {
    valuesSlider.noUiSlider.set(['13', '16'])
    start_hour = '13';
    finish_hour = '16';
    console.log(start_hour, finish_hour);
    renderData();
  }, 2000);

  setTimeout(function() {
    valuesSlider.noUiSlider.set(['16', '20'])
    start_hour = '16';
    finish_hour = '20';
    console.log(start_hour, finish_hour);
    renderData()
  }, 4000);

  setTimeout(function() {
    valuesSlider.noUiSlider.set(['20', '24'])
    start_hour = '20';
    finish_hour = '24';
    console.log(start_hour, finish_hour);
    renderData();
  }, 6000);

}

let animation = document.getElementById('button-animation')
animation.addEventListener('click', animateTimePeriods);


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
        getRadius: 45,
        // getFillColor:  d => {
        //   if (d.hour_taken < 13) {
        //     return [255, 166, 0]; // Pink color
        //   } else if (d.hour_taken < 18) {
        //     return [239,86,117]; // Blue color
        //   } else {
        //     return [0,63,92]; // Blue color
        //   }},
        getFillColor:  d => {
          if (d.hour_taken < 16) {
            return [255, 0, 128]; // Pink color
          } else {
            return [0, 128, 255]; // Blue color
          }
        },
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
    // let props = {
    //   getTooltip: ({object}) => object && { 
    //     html:`  <div>
    //           <div class="photo-thumbnail">
    //           <img
    //             src=${object.photo_url2}
    //             alt="photo-thumbnail"
    //           />
    //         </div>
    //         <div><b>Title:</b> ${object.title}</div>
    //         <div><b>Author:</b> ${object.author_name}</div>
    //       </div>`,

    //       style: {
    //         backgroundColor: '#fff',
    //         color: '#333359',
    //         fontSize: '0.8em',
    //         borderRadius: '6px',
    //         padding: '0px 10px 10px 10px'
    //       }
    //   }
    // };
    deckOverlay.setMap(mapPhoto);
    // deckOverlay.setProps(props)
}


function initMap() {
  

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;
      document.getElementsByClassName('progress')[0].remove();
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

