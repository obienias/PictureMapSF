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

let photoList;

start_hour = 5;
finish_hour = 12;

let mapBounds;
let photosByBounds;

let squarePhotoUrl;

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

noUiSlider.create(valuesSlider, {
  start: ['1 AM', '11 PM'],
  range: { min: 0, max: valuesForSlider.length - 1 },
  // steps of 1
  step: 1,
  tooltips: true,
  // format: format,
  pips: {
    mode: 'steps',
    format: format,
    density: 50,

  },
});

// The display values can be used to control the slider
valuesSlider.noUiSlider.set(['5', '12']);

valuesSlider.addEventListener('click', function () {
  hoursList = valuesSlider.noUiSlider.get();
  start_hour = hoursList[0];
  finish_hour = hoursList[1];
  console.log(start_hour, finish_hour)
  displayMarkers();
  console.log(filtered_photos)
});

function handleValuesSliderClick(Slider, start, end) {
  Slider.addEventListener('click', function () {
    console.log("button clicked")
    valuesSlider.noUiSlider.set([start, end])
    start_hour = start;
    finish_hour = end;
    console.log(start_hour, finish_hour);
    displayMarkers();
    console.log(filtered_photos);
  });
}

let morning = document.getElementById('button-morning')
handleValuesSliderClick(morning, '5', '12');
let afternoon = document.getElementById('button-afternoon')

handleValuesSliderClick(afternoon, '12', '17');
let evening = document.getElementById('button-evening')

handleValuesSliderClick(evening, '17', '21');
let night = document.getElementById('button-night')

handleValuesSliderClick(night, '21', '24');



// Filter the photos based on the time of day

function filterPhotoBounds(filtered_photos, photosByBounds, mapBounds) {
  photosByBounds = []
  for (const photo of filtered_photos) {
    if (photo.author_name !== "anthonynachor") {
      let photoLocation = {
        lat: photo.latitude,
        lng: photo.longitude,
      }
      if (mapBounds.contains(photoLocation)) {
        photosByBounds.push(photo)
      }
    }
  }

  return photosByBounds;
};



function getRandomPhotos(numPhotos) {
  let randomPhotos = [];
  let indicesList = [];
  let maxIndex = photoList.length - 1;

  if (numPhotos > photoList.length) {
    numPhotos = photoList.length;
  }

  for (let i = 0; i < numPhotos; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * maxIndex);
    } while (indicesList.includes(randomIndex) && indicesList.length < maxIndex);

    randomPhotos.push(photoList[randomIndex]);
    indicesList.push(randomIndex);
  }

  console.log(randomPhotos);
  console.log(indicesList);
  return randomPhotos;
}

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
      <a href=${photo.photo_url_main}><img
          src=${photo.photo_url2}
          alt="photo-thumbnail"
        />
      </a>
      </div>
    </div>`
    //      <ul class="photo-info">
    // <li><b>Photo title: </b>${photo.title}</li>
    // <li><b>Author name: </b>${photo.author_name}</li>
    // <li><b>Date: </b>${photo.time_taken}</li>
    // </ul>

    const photoMarker = new google.maps.Marker({
      position: {
        lat: photo.latitude,
        lng: photo.longitude,

      },
      title: `Photo title: ${photo.title}`,
      icon: {
        url: '/static/img/marker_color2.png',
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
          scale: (15 + (count / stats.clusters.markers.max) * 35),
          fillColor: "#246F81",
          //246F81, 56d4ee, 04bceb, 244047, e57f84, 246F81, 6592A0
          fillOpacity: 0.5,
          strokeWeight: 0
        },
        position,
        // adjust zIndex to be above other markers
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      })

  };

  // const algorithm = new gridAlgorithm.GridAlgorithm({
  //   gridSize: 60
  // });

  MarkerClusters = new markerClusterer.MarkerClusterer({ map: mapPhoto, markers: all_markers, renderer });

}

function generateGalleryHTML(images) {
  const items = images.map(image => `
    <a href="${image.photo_url2}" data-fancybox="gallery" data-caption="Image caption">
      <img src="${squarePhotoUrl = image.photo_url2.replace("_b.", "_q.")}" />
    </a>
  `);
  const html = `
    <div class="grid">
      ${items.join("")}
    </div>
  `;
  return html;
}

function initMap() {

  //create map first, get bounds, get

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;

      photoInfo = new google.maps.InfoWindow();
      photoList = photos_info;

      displayMarkers();
      mapPhoto.addListener('idle', () => {

        mapBounds = mapPhoto.getBounds();
        console.log(mapBounds);

        let photos = filterPhotoBounds(filtered_photos, photosByBounds, mapBounds);
        photoList = photos;

        const randomImages = getRandomPhotos(18);
        const galleryHTML = generateGalleryHTML(randomImages);
        document.querySelector("#gallery").innerHTML = galleryHTML;

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

