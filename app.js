var map;


      // Create a new blank array for all the listing markers.
var markers = ko.observableArray();
	  
var locations = [
	  {
		  name: 'Coastal Peaks Coffee',
		  address: '3566 S Higuera St #100, San Luis Obispo, CA 93401',
		  area: {
			  lat: 35.1259661,
			  lng: -120.7455663
		  }
	  },
	  {
		  name: 'BlackHorse Espresso & Bakery',
		  address: '12300 Los Osos Valley Rd, San Luis Obispo, CA 93405',
		  area: {
			  lat: 35.2715808,
			  lng: -120.7000597
		  }
	  },
	  {
		  name: 'Kreuzberg',
		  address: '685 Higuera St, San Luis Obispo, CA 93401',
		  area: {
			  lat: 35.2715808,
			  lng:-120.7000597
		  }
	  },
	  {
		  name: 'Ascendo Coffee',
		  address: '974 Monterey St',
		  area: {
			  lat: 35.2715808,
			  lng: -120.7000597
		  }
	  },
	  {
		  name: 'Scout Coffee',
		  address: '880 Foothill Blvd, San Luis Obispo, CA 93405',
		  area: {
			  lat: 35.2715808,
			  lng: -120.7000597
		  }
	  }
	];

var locationSet = function (location){
		
		this.name = ko.observable(location.name);
		this.address = ko.observable(location.address);
		this.lat = ko.observable(location.area.lat);
		this.lng = ko.observable(location.area.lng);
		this.area = ko.observable(location.area);
		
		var marker = new google.maps.Marker({
            position: this.area(),
            title: this.name(),
            animation: google.maps.Animation.DROP
          });
		
		this.marker.addListener('click', function() {
			if (this.getAnimation() !== null) {
				this.setAnimation(null);
			} else {
				this.setAnimation(google.maps.Animation.BOUNCE);
			}
		});
		this.marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
       
        });
		
		showListings(this.marker);

};
	
	
function initMap() {
		 
        // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 35.2715808, lng: -120.7000597},
          zoom: 13,
          mapTypeControl: false
        });
	
	ko.applyBindings(viewModel);
	
}
	
	  
var viewModel = function() {
		
	var bounds = new google.maps.LatLngBounds();
		
	locations.forEach(function(location){
		var marker = new locationSet(location);
		markers.push(marker);
	
	});
		
	var largeInfowindow = new google.maps.InfoWindow();
	}

function showListings(marker) {
      var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
          marker.setMap(map);
          bounds.extend(marker.position);
          map.fitBounds(bounds);
}

/*
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infowindow.setContent('');
          infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
          infowindow.open(map, marker);
        }
      }
	 

*/