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
        url: '/static/img/marker.png',
        scaledSize: {
          width: 15,
          height: 15,
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

//   let renderer = {
//     render: function ({ count, position }, stats) {
//           // use d3-interpolateRgb to interpolate between red and blue
//           const color = this.palette(count / stats.clusters.markers.max);
//           // // create svg url with fill color
//           const svg = window.btoa(`
//             <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
//               <circle cx="120" cy="120" opacity=".8" r="70" />    
//             </svg>`);
//           // create marker using svg icon
//           return new google.maps.Marker({
//               position,
//               icon: {
//                 url: `data:image/svg+xml;base64,${svg}`,
//                 scaledSize: new google.maps.Size(75, 75),
//             },
//               label: {
//                   text: String(count),
//                   color: "rgba(255,255,255,0.9)",
//                   fontSize: "12px",
//               },
//               // adjust zIndex to be above other markers
//               zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
//           });
//       }};

// MarkerClusters = new MarkerClusterer(mapPhoto, all_markers, renderer);

    countTotal = all_markers.length
    const maxDim= 200;
    const minDim = 30;
    const k = 5;
    const x = 0.35;

    let dimension = (maxDim - minDim) / (1 + Math.exp(-k*(count/countTotal - x))) + minDim;

    const svg = window.btoa(`
    <svg fill="#edba31" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <circle cx="120" cy="120" opacity="1" r="70" />
    <circle cx="120" cy="120" opacity=".7" r="90" />
    <circle cx="120" cy="120" opacity=".3" r="110" />
    <circle cx="120" cy="120" opacity=".2" r="130" />
    </svg>`);

    const renderer = {
    render: ({ count, position }, stats) =>

      new google.maps.Marker({
      label: { text: String(count), color: "#FFFFFF", fontSize: "12px", fontWeight: "600" },
      icon: {
          url: '/static/img/m1.png',
          // scaledSize: new google.maps.Size(((maxDim - minDim) / (1 + Math.exp(-k*(count/stats.clusters.markers.max - x))) + minDim),((maxDim - minDim) / (1 + Math.exp(-k*(count/stats.clusters.markers.max - x))) + minDim)),
          scaledSize: new google.maps.Size((40+(count/stats.clusters.markers.max)*50),(40+(count/stats.clusters.markers.max)*50))
        },
      position,
      // adjust zIndex to be above other markers
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      })

    };

    // const markerCluster = new MarkerClusterer({ map, markers, renderer });
    /*
      {
        map: map,
        markers: markers,
        renderer: renderer
      }
    */
    MarkerClusters = new markerClusterer.MarkerClusterer({map: mapPhoto, markers: all_markers, renderer});

  //creates clusters for markers
  // MarkerClusters = new MarkerClusterer(mapPhoto, all_markers, {
  //   // imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
  //   // imagePath: 'static/img/m',
  //   palette: d3.interpolateRgb('red', 'blue'),
  //   maxZoom: 15,
  //   // styles: [
  //   //   {
  //   //     textColor: 'white',
  //   //     url: '/static/img/m1.png',
  //   //     height: 50,
  //   //     width: 50,
  //   //     // scaledSize: {
  //   //     //   width: 75,
  //   //     //   height: 75,}
  //   //     },
  //   //  {
  //   //     textColor: 'white',
  //   //     url: '/static/img/m1.png',
  //   //     height: 50,
  //   //     width: 50
  //   //   },
  //   //  {
  //   //     textColor: 'white',
  //   //     url: '/static/img/m1.png',
  //   //     height: 50,
  //   //     width: 50
  //   //   }
  //   // ]
  //   render: function ({ count, position }, stats) {
  //     // use d3-interpolateRgb to interpolate between red and blue
  //     const color = this.palette(count / stats.clusters.markers.max);
  //     // // create svg url with fill color
  //     const svg = window.btoa(`
  //       <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  //         <circle cx="120" cy="120" opacity=".8" r="70" />    
  //       </svg>`);
  //     // create marker using svg icon
  //     return new google.maps.Marker({
  //         position,
  //         icon: {
  //           scaledSize: google.maps.scaledSize(150, 150),
  //         },
  //         label: {
  //             text: String(count),
  //             color: "rgba(255,255,255,0.9)",
  //             fontSize: "12px",
  //         },
  //         // adjust zIndex to be above other markers
  //         zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
  //     });
  // }

//   }
  // });

  // console.log(MarkerClusters)
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

      // //polygon 
      // let coords = [[[[-122.51316127599989,37.77500805900007],[-122.50267096999994,37.77547056700007],[-122.50308645199993,37.781176767000034],[-122.5030991939999,37.78129374400004],[-122.49332613999991,37.781742992000034],[-122.49349051899992,37.783498371000064],[-122.48715071499993,37.783785427000055],[-122.47857883799992,37.78417398600004],[-122.4777669469999,37.77286365500004],[-122.48419420099992,37.77256906100007],[-122.4895394799999,37.772325472000034],[-122.49597201599994,37.77203201400005],[-122.5034726909999,37.771689379000065],[-122.50775066499995,37.771495033000065],[-122.51105375499992,37.77134249900007],[-122.51314054099993,37.771331115000066],[-122.51316127599989,37.77500805900007]]]];

      // // Flatten the nested list
      // let flat_coords = coords.flat(2);

      // // Convert to desired format
      // let new_coords = flat_coords.map(coord => {
      //     let lat = coord[1];
      //     let lng = coord[0];
      //     return {"lat": lat, "lng": lng};
      // });
     
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
    zoom: 12,
    styles: MAPSTYLES,
    mapTypeControl: false,
    streetViewControl: false,
  });

}

