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
let neighbourhoodAreaList = [0.4717220034755423, 0.392662061532891, 6.282329177512802, 0.33642692190992596, 2.31859964345245, 0.5754542104143522, 0.40396178795147597, 0.4973643896049165, 1.2714866431832355, 3.0222675804031174, 4.466669328565216, 0.5878501788973357, 0.5964897705313612, 0.8319193538345234, 0.3082281714905433, 0.6541695574933317, 1.5011076942829664, 0.25949082016917024, 0.3680927037187743, 0.5468686556097478, 0.5384243376591927, 0.298718088167252, 0.2525871371382279, 0.5827122716815025, 0.34503305654393335, 0.45283429236938566, 0.15643989477767908, 0.4383042656238453, 0.1894558998496591, 0.38583173310366303, 0.7095191898608939, 3.1684121836962404, 0.6489696486028206, 1.6400632140381033, 0.6568295224870825, 1.6996662607769641, 0.8678023480718736, 0.24980387107185825, 7.209172832571398, 3.1154289316542423, 0.7117552091570023, 1.2882937951634037, 6.434641469563398, 1.708732470569223, 0.5247409941261678, 0.5953020576003591, 0.7403473097934868, 0.5563845554832193, 0.562137542834089, 0.8765199076708653, 0.4407164840224347, 0.5535376598028231, 0.9532380412946732, 3.185685577627099, 2.3978370166074163, 0.43396303728214775, 2.661243519295556, 0.6489830845345019, 1.4807058171872653, 0.6032929439835272, 0.3093743331927103, 0.9690000709414828, 0.4589577050757479, 0.5911512142439445, 0.28358361809385424, 0.9682111153466482, 0.7749193783370416, 0.800748167874378, 0.6291790659987516, 0.2337752301152894, 0.2692590677519406, 0.1499869564601299, 0.5796615610804462, 0.987248200083861, 1.3963372262781941, 0.38385487887682157, 1.27430247609434, 0.8299674378060232, 0.5875730921265395, 3.03229851326731, 1.6218368897233262, 0.7577114048987349, 1.0330387219298185, 0.37735841959558425, 1.7647689626759098, 1.4840315301604499, 0.8771686122973089, 2.635108527516606, 1.0523311402529358, 0.8630174056925579, 0.4526009587606936, 1.710946970740823, 1.9252213605548758, 0.5866365517596785, 0.4193150922464723, 1.3029959574977905, 1.178378892353669, 0.9169025016477359, 0.9698147898162918, 0.4331303919344816, 0.677815637969695, 0.5024456669575693, 0.2992822057816134, 1.8303896631054084, 0.6207627574662486, 0.32574304329810116, 0.3086110242705371, 0.84727218214972, 1.150571345178461, 0.7397412176829409, 0.4593952093314699, 0.6950052406798392, 0.29093555673203825, 0.35154623858214146, 0.7761318643787165, 0.44276730530174624, 0.551987618687304]
let ratioList = [];
let photoCount;
let photoList;


//calculate ration of neighbourhood area to photo count
for (let i = 0; i < neighbourhoodPhotoCount.length; i++) {
  let ratio = neighbourhoodPhotoCount[i] / neighbourhoodAreaList[i];
  ratioList.push(ratio);
}

let maxPhotoCount = Math.max(...ratioList)


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

// // Filter the photos based on the time of day
// function get_photo_by_hour(start, end, photos_info) {
//   let filtered_photos = [];
//   if (start === 0 || end === 0) {
//     return photos_info;
//   }
//   for (let photo of photos_info) {
//     if (photo.hour_taken >= start && photo.hour_taken < end) {
//       filtered_photos.push(photo)

//     }
//   }
//   return filtered_photos
// }

// function deleteMarkers() {

//   for (const marker of all_markers) {
//     marker.setMap(null)
//   }
//   all_markers = [];

// };



// function displayNeighbourhoods() {

// }


// const select = document.getElementById(elemnent_id)


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
  let imageUrls = photos.map(photo => photo.photo_url2);
  console.log(imageUrls)

  // create an array of captions for the lightbox
  let captions = photos.map(photo => photo.title);

  // display the lightbox
  // $.fancybox.open(imageUrls, captions, options);

  let fancyboxItems = photos.map(photo => ({
    src: photo.photo_url2,
    thumb: photo.photo_url2,
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

function openLightboxGallery() {
  let numPhotos = 20; // specify the number of photos to display
  let randomPhotos = getRandomPhotos(numPhotos);
  displayLightboxGallery(randomPhotos);
}

function initMap() {
  

  fetch('/api/markers')
    .then((response) => response.json())
    .then((responseData) => {

      photos_info = responseData;
      // filtered_photos = get_photo_by_hour(start_hour, finish_hour, photos_info);
      // let photoCountTotal = filtered_photos.length;
      // console.log (photoCountTotal);
      


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

          
          // list od neighbourhood names
          let neighbourhoodNamesList = [];
          for (const item of neighbourhoods_info) {
            let name = item.name;
            neighbourhoodNamesList.push(name);
          };

          //ratio of photos to area
          const neighbourhoodRatios = neighbourhoodPhotoCount.map((count, index) => {
            const ratio = count / neighbourhoodAreaList[index];
            return { name: neighbourhoodNamesList[index], ratio };
          });
          
          // Sort the array of objects by ratio in descending order
          neighbourhoodRatios.sort((a, b) => b.ratio - a.ratio);
          
          // Create a list of the 8 most popular neighbourhood names
          const popularNeighbourhoodNames = neighbourhoodRatios.slice(0, 8).map(neighbourhood => neighbourhood.name);
          
          // Update the HTML element with the list of popular neighbourhood names
          const neighbourhoodListElement = document.querySelector('#neighbourhood_list');
          neighbourhoodListElement.innerHTML = `<ul><li>${popularNeighbourhoodNames.join('</li><li>')}</li></ul>`;

          // neighbourhoodListElement.querySelectorAll('li').forEach((listItem) => {
          //   // get the name of the neighbourhood from the list item
          //   const neighbourhoodName = listItem.textContent;
          
          //   // find the polygon on the map with the same title as the neighbourhood
          //   const neighbourhoodPolygon = polygonList.find((polygon) => polygon.getTitle() === neighbourhoodName);
          
          //   // add click event listener to the list item
          //   listItem.addEventListener('click', () => {
          //     // open the info window for the neighbourhood polygon
          //     for (const item of neighbourhoods_info) {
          //       neighbourhoodInfoContent = `
          //     <div class="window-content">

          //       <ul class="neighbourhood-info">
          //         <li><b>Neighbourhood name: </b>${item.name}</li>
          //         <li><b>Link: </b>${item.url2}</li>
          //         <button onclick="openLightboxGallery()">View Photos</button>
          //       </ul>
          //     </div>`};
          //     neighbourhoodInfo.setContent(neighbourhoodInfoContent);
          //     neighbourhoodInfo.open(mapPhoto, mapPhoto.getBounds().getCenter());
          //   });
          // });

          // popularNeighbourhoodNames.forEach(name => {
          //   const listItem = neighbourhoodListElement.querySelector(`"li:contains('${name}')"`);
          //   listItem.addEventListener('click', () => {
          //     // Find the polygon with the corresponding neighbourhood name and open the info window
          //     const polygon = polygonList.find(p => p.title === name);
          //     if (polygon) {
          //       const neighbourhoodInfoContent = `
          //         <div class="window-content">
          
          //           <ul class="neighbourhood-info">
          //             <li><b>Neighbourhood name: </b>${polygon.title}</li>
          //             <li><b>Link: </b>${item.url2}</li>
          //             <button onclick="openLightboxGallery()">View Photos</button>
          //           </ul>
          //         </div>`;
          //       neighbourhoodInfo.setContent(neighbourhoodInfoContent);
          //       neighbourhoodInfo.open(mapPhoto, polygon.getBounds().getCenter());
          //     }
          //   });
          // });

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
            let neighbourhoodInfoContent = `
              <div class="window-content">

                <ul class="neighbourhood-info">
                  <li><b>Neighbourhood name: </b>${item.name}</li>
                  <br>
                  <li><b>Link: </b>${item.url}</li>
                  <br>
                  <button onclick="openLightboxGallery()">View Photos</button>
                </ul>
              </div>`

            let PolyCenter = newPolygon.getBoundingBox().getCenter();

            const centerMarker = new google.maps.Marker({
              position: PolyCenter,
              visible: false,
              map: mapPhoto,
            })

            //set polygon fill opacity
            let photoRatioCount = ratioList[index]
            newPolygon.setOptions({
              fillOpacity: Math.min(0.1 + (photoRatioCount / (maxPhotoCount)*1.4), 0.65),
            });


            index += 1;

            //add listener to polygon on click
            google.maps.event.addListener(newPolygon, 'click', () => {
              neighbourhoodInfo.setContent(neighbourhoodInfoContent);
              neighbourhoodInfo.open(mapPhoto, centerMarker);
              console.log(item.name)
              let photos = filterPhotoNeighbourhood (photos_info, photosByNeighbourhood, newPolygon);

              photoList = photos;

              // let numPhotos = 20; // specify the number of photos to display
              // let randomPhotos = getRandomPhotos(numPhotos);
              // displayLightboxGallery(randomPhotos);

              // mapPhoto.centerObject(newPolygon);
            });

            // highlight polygon on mousoover
            google.maps.event.addListener(newPolygon, 'mouseover', () => {
              newPolygon.setOptions({
                fillOpacity: 0.65,
              });
            });

            google.maps.event.addListener(newPolygon,"mouseout", () => {
              newPolygon.setOptions({fillOpacity: Math.min(0.1 + (photoRatioCount / (maxPhotoCount)*1.4), 0.65)});
             });
            
          }  

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

