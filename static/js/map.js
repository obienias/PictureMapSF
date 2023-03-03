'use strict';

// We use a function declaration for initMap because we actually *do* need
// to rely on value-hoisting in this circumstance.
function initMap() {
  const sfCoords = {
    lat: 37.773972,
    lng: -122.431297,
  };

  fetch('/api/markers')
    .then((response) => response.json())
    .then((photos_info) => {
      console.log(photos_info);
      for (const location of photos_info) {
        const photoMarker = new google.maps.Marker({
          position: {
            lat: location.latitude,
            lng: location.longitude,
          },
          title: `Photo title: ${location.title}`,
          icon: {
            url: '/static/img/marker.svg',
            scaledSize: {
              width: 30,
              height: 30,
            }
          },
          map: map, // same as saying map: map
        
        })   
      }
    })
    



  const map = new google.maps.Map(document.querySelector('#map'), {
    center: sfCoords,
    zoom: 12,
  });

}
