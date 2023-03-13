'use strict';


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

function initMap() {
  const sfCoords = {
    lat: 37.773972,
    lng: -122.431297,
  };

  fetch('/api/markers')
    .then((response) => response.json())
    .then((photos_info) => {
      // console.log(photos_info);

      const photoInfo = new google.maps.InfoWindow();

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

      //polygon 
      let coords = [[[[-122.51316127599989,37.77500805900007],[-122.50267096999994,37.77547056700007],[-122.50308645199993,37.781176767000034],[-122.5030991939999,37.78129374400004],[-122.49332613999991,37.781742992000034],[-122.49349051899992,37.783498371000064],[-122.48715071499993,37.783785427000055],[-122.47857883799992,37.78417398600004],[-122.4777669469999,37.77286365500004],[-122.48419420099992,37.77256906100007],[-122.4895394799999,37.772325472000034],[-122.49597201599994,37.77203201400005],[-122.5034726909999,37.771689379000065],[-122.50775066499995,37.771495033000065],[-122.51105375499992,37.77134249900007],[-122.51314054099993,37.771331115000066],[-122.51316127599989,37.77500805900007]]]];

      // Flatten the nested list
      let flat_coords = coords.flat(2);

      // Convert to desired format
      let new_coords = flat_coords.map(coord => {
          let lat = coord[1];
          let lng = coord[0];
          return {"lat": lat, "lng": lng};
      });

      // Print the new coordinates
      console.log(new_coords);


      //create sample polygon
      const outerRichmond = new google.maps.Polygon({
          paths: new_coords,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });

      outerRichmond.setMap(mapPhoto);

      let all_markers = [];

      function deleteMarkers() {

        for (const marker of all_markers) {
          marker.setMap(null)
        }
        all_markers = [];

      };

      let MarkerClusters = null;

      function displayMarkers() {
        deleteMarkers();

        // check if MarkerClusters variable exist already 
        if (MarkerClusters) {
          MarkerClusters.clearMarkers();
        }
        // let MarkerClusters = new MarkerClusterer(map, all_markers)

        //loops over filtered_photos and create markers, information for info-window 
        const filtered_photos = get_photo_by_hour(start_hour, finish_hour, photos_info);
        console.log(filtered_photos);
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
            // icon: svgMarker,
            // icon: {
            //   url: '/static/img/marker.svg',
            //   scaledSize: {
            //     width: 15,
            //     height: 15,
            //   }
            // },
            map: mapPhoto,
          })
          all_markers.push(photoMarker);

          photoMarker.addListener('click', () => {
            photoInfo.close();
            photoInfo.setContent(photoInfoContent);
            photoInfo.open(map, photoMarker);
          });

          
        }

        //creates clusters for markers
        let MarkerClusters = new MarkerClusterer(mapPhoto, all_markers, {
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
          // palette: d3.interpolateRgb('red', 'blue'),
          maxZoom: 15,
          // styles: [
          //   {
          //     textColor: 'white',
          //     url: '/static/img/m1.png',
          //     height: 50,
          //     width: 50,
          //     // scaledSize: {
          //     //   width: 75,
          //     //   height: 75,}
          //     },
          //  {
          //     textColor: 'white',
          //     url: '/static/img/m1.png',
          //     height: 50,
          //     width: 50
          //   },
          //  {
          //     textColor: 'white',
          //     url: '/static/img/m1.png',
          //     height: 50,
          //     width: 50
          //   }
          // ]
        //   renderer: function ({ count, position }, stats) {const color =
        //     count > Math.max(10, stats.clusters.markers.mean)
        //       ? "#ff0000"
        //       : "#0000ff";
          
      
        //   // create svg url with fill color
        //   const svg = window.btoa(`
        //   <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        //     <circle cx="120" cy="120" opacity=".6" r="70" />
        //     <circle cx="120" cy="120" opacity=".3" r="90" />
        //     <circle cx="120" cy="120" opacity=".2" r="110" />
        //     <circle cx="120" cy="120" opacity=".1" r="130" />
        //   </svg>`);
          
        //   // create marker using svg icon
        //   return new google.maps.Marker({
        //     position,
        //     icon: {
        //       url: `data:image/svg+xml;base64,${svg}`,
        //       scaledSize: new google.maps.Size(45, 45),
        //     },
        //     label: {
        //       text: String(count),
        //       color: "rgba(255,255,255,0.9)",
        //       fontSize: "12px",
        //     },
        //     // adjust zIndex to be above other markers
        //     zIndex: 1000 + count,
        //   });
        // }
      
      //   }
        });

        console.log(MarkerClusters)
        }

        displayMarkers();

      
    });

  

  const mapPhoto = new google.maps.Map(document.querySelector('#map'), {
    center: sfCoords,
    zoom: 12,
    styles: MAPSTYLES,
    mapTypeControl: false,
    streetViewControl: false,
  });

}

