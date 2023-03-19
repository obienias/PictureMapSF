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
let start_hour = 0;
let finish_hour = 0;

let minRange;
let maxRange;



// var range = document.getElementById('range');

// noUiSlider.create(range, {
//     start: [ 20, 80 ], // Handle start position
//     step: 10, // Slider moves in increments of '10'
//     margin: 20, // Handles must be more than '20' apart
//     connect: true, // Display a colored bar between the handles
//     direction: 'rtl', // Put '0' at the bottom of the slider
//     orientation: 'vertical', // Orient the slider vertically
//     behaviour: 'tap-drag', // Move handle on tap, bar is draggable
//     range: { // Slider can select '0' to '100'
//         'min': 0,
//         'max': 100
//     },
//     pips: { // Show a scale with the slider
//         mode: 'steps',
//         density: 2
//     }
// });

//     var valueInput = document.getElementById('value-input'),
//             valueSpan = document.getElementById('value-span');


//function to generate dropdown menu for each hour
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

// start_hour = 0;
// finish_hour = 0;

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


// function displayNeighbourhoods() {
//   for (let neighbourhood of neighbourhoods_info) {
//     console.log(neighbourhood)
//     // let coords =  JSON.parse(neighbourhood["coordinates"]);
//     // console.log(coords)
//     const name = neighbourhood.name;
//     // const newPolygon = new google.maps.Polygon({
//     //       paths: coords,
//     //       strokeColor: "#FF0000",
//     //       strokeOpacity: 0.8,
//     //       strokeWeight: 1,
//     //       fillColor: "#FF0000",
//     //       fillOpacity: 0.35,
//     //     });
//   }
// }

function initMap() {
  

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;

      photoInfo = new google.maps.InfoWindow();
     
      displayMarkers();

      // fetch('/api/neighbourhoods')
      //   .then((response) => response.json())
      //   .then((responseData2) => {

      //     neighbourhoods_info = responseData2;
      //     console.log(neighbourhoods_info);

      //     neighbourhoodInfo = new google.maps.InfoWindow();


      //     google.maps.Polygon.prototype.getBoundingBox = function() {
      //       var bounds = new google.maps.LatLngBounds();
          
      //       this.getPath().forEach(function(element,index) {
      //         bounds.extend(element)
      //       });
      //       return(bounds);
      //     };


      //     for (const item of neighbourhoods_info) {
      //       let coords =  JSON.parse(item.coordinates);
      //       const newPolygon = new google.maps.Polygon({
      //         title: item.name,
      //         paths: coords,
      //         strokeColor: "#FF0000",
      //         strokeOpacity: 0.8,
      //         strokeWeight: 1,
      //         fillColor: "#FF0000",
      //         fillOpacity: 0.35,
      //       });

      //       newPolygon.setMap(mapPhoto);
      //       polygonList.push(newPolygon);

      //       const neighbourhoodInfoContent = `
      //         <div class="window-content">

      //           <ul class="photo-info">
      //             <li><b>Naighbourhood name: </b>${item.name}</li>
      //             <li><b>Link: </b>${item.url}</li>
      //           </ul>
      //         </div>`
      //       // console.log(item.name);

      //       // let PolyCenter = newPolygon.getBoundingBox().getCenter();

      //       // newPolygon.addListener('click', () => {
      //       //   neighbourhoodInfo.close();
      //       //   neighbourhoodInfo.setContent(neighbourhoodInfoContent);
      //       //   neighbourhoodInfo.open(mapPhoto, { lat: 37.773972, lng: -122.4194});
      //       //   // mapPhoto.setCenter(37.773972,-122.4194)
      //       // });
      //     }

      //     // console.log(polygonList);

      //     let testPolygon = polygonList[2];
      //     testPolygon.setMap(mapPhoto);

      //     let PolyCenter = testPolygon.getBoundingBox().getCenter();

      //     const centerMarker = new google.maps.Marker({
      //       position: PolyCenter,
      //       title: 'test center',
      //       // icon: {
      //       //   url: '/static/img/marker.svg',
      //       //   scaledSize: {
      //       //     width: 15,
      //       //     height: 15,
      //       //   }
      //       // },
      //       map: mapPhoto,
      //     })

      //     const contentString =
      //         '<div id="content">' +
      //         '<div id="siteNotice">' +
      //         "</div>" +
      //         '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
      //         '<div id="bodyContent">' +
      //         "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
      //         "sandstone rock formation in the southern part of the " +
      //         "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
      //         "Heritage Site.</p>" +
      //         '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
      //         "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
      //         "(last visited June 22, 2009).</p>" +
      //         "</div>" +
      //         "</div>"

      //     console.log (testPolygon.getBoundingBox().getCenter());

      //     google.maps.event.addListener(testPolygon, 'click', () => {
      //       // alert ("clicked!");
      //       neighbourhoodInfo.setContent(contentString);
      //       neighbourhoodInfo.open(mapPhoto, centerMarker);
      //       // mapPhoto.setCenter(37.773972,-122.4194)
      //     });



      //     // for (const photo of filtered_photos) {

      //     //   let photoLocation = {
      //     //     lat: photo.latitude,
      //     //     lng: photo.longitude,
      //     //   }

      //     //   if (google.maps.geometry.poly.containsLocation(photoLocation, polygonList[2])) {
      //     //     photosByNeighbourhood.push(photo)

      //     //   }

      //     // }   
          
      //     // console.log(photosByNeighbourhood)

      //      // displayNeighbourhoods()        

      //   });
     

    });

  mapPhoto = new google.maps.Map(document.querySelector('#map'), {
    center: sfCoords,
    zoom: 13,
    styles: MAPSTYLES,
    mapTypeControl: false,
    streetViewControl: false,
  });

}

