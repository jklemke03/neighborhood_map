var map;
var markers = ko.observableArray();
var largeInfowindow;

	  
var locations = [
	  {
		  name: 'The Station',
		  address: '311 Higuera St, San Luis Obispo, CA 93401',
		  location: {
			  lat: 35.2798453,
			  lng: -120.6697681
		  }
	  },
	  {
		  name: 'BlackHorse Espresso & Bakery',
		  address: '12300 Los Osos Valley Rd, San Luis Obispo, CA 93405',
		  location: {
			  lat: 35.2715808,
			  lng: -120.7000597
		  }
	  },
	  {
		  name: 'Kreuzberg',
		  address: '685 Higuera St, San Luis Obispo, CA 93401',
		  location: {
			  lat: 35.2523232,
			  lng:-120.6803287
		  }
	  },
	  {
		  name: 'Ascendo Coffee',
		  address: '974 Monterey St',
		  location: {
			  lat: 35.281086,
			  lng: -120.6623541
		  }
	  },
	  {
		  name: 'Scout Coffee',
		  address: '880 Foothill Blvd, San Luis Obispo, CA 93405',
		  location: {
			  lat: 35.2803708,
			  lng: -120.6618288
		  }
	  }
	];

var locationMarkers = function (location){
	
		var self = this;
		
		self.name = ko.observable(location.name);
		self.lat = ko.observable(location.location.lat);
		self.lng = ko.observable(location.location.lng);
		self.position = ko.observable(location.location);
		self.URL = "";
		self.street = "";
		self.city = "";
		self.phone = "";
		self.showLocation = ko.observable(true);
		
		// Foursquare API Link to call.
        var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + self.lat() + ',' + self.lng() + '&client_id=WSUWXMMHAVDGT3ERSHGIFBVZ1HIM0LUC2ZSNWH4NISHAHTRO&client_secret=ZYS3WWQG2ZP2DHRTIDTPTXZW2TSEOZWWHR3ANRKJQCJGQV5C' + '&v=20171108' + '&query=' + self.name();
		
		// Gets the data from foursquare and store it into its' own variables using JQuery.
		$.getJSON(foursquareURL).done(function (location) {
        var markResult = location.response.venues[0];
        self.URL = markResult.url;
        if (typeof self.URL === 'undefined') {
            self.URL = "";
        }
        self.street = markResult.location.formattedAddress[0] || 'Address Informaiton Not Available';
        self.city = markResult.location.formattedAddress[1] || 'Address Information Not Available';
        self.phone = markResult.contact.phone || 'Phone Information Not Available';
		}).fail(function () {
			$('.list').html('There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.');
		});

		
		self.marker = new google.maps.Marker({
            position: self.position(),
            name: self.name(),
            animation: google.maps.Animation.DROP
          });
		
		self.marker.addListener('click', function() {
			if (this.getAnimation() !== null) {
				this.setAnimation(null);
			} else {
				this.setAnimation(google.maps.Animation.BOUNCE);
			}
		});
		
		//sets a default clear contentString
		self.contentString = "";
        // Puts the content string inside infowindow.
        this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

       // When marker is clicked on open up infowindow designated to the marker with it's information.
        self.marker.addListener('click', function(){
           self.contentString = '<div class="info-window-content"><div class="title"><b>' + self.name() + "</b></div>" +
        '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content">' + self.phone + "</div></div>";
           self.infoWindow.setContent(self.contentString);
           self.infoWindow.open(map, this);
		   
	    });
		
		self.infoWindow.addListener('closeclick', function() {
            self.infoWindow = null;
         });

		self.marker.setMap(map);

};

	

	
	  
var viewModel = function() {
	
	var self = this;
    // Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 35.2767664, lng: -120.6653047},
          zoom: 14,
          mapTypeControl: false
    });
	    // initialize infoWindow
    largeInfowindow = new google.maps.InfoWindow({
        content: ''
    });
	
		
	var bounds = new google.maps.LatLngBounds();
	//largeInfowindow = new google.maps.InfoWindow();	
		
	locations.forEach(function(location){
		var marker = new locationMarkers(location);
		markers.push(marker);
	
	});
	locationSearch.query.subscribe(locationSearch.search);
    

};
	
var locationSearch = {
  self: this,
  query: ko.observable(''),

  search: function(value) {

    if (value == '') return;

    for (var location in markers()) {
      if (markers()[location].name().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
			markers()[location].showLocation(true);
			markers()[location].marker.setVisible(true);
      } else {
		  markers()[location].showLocation(false);
		  markers()[location].marker.setVisible(false);
	  }
    }
  }
};

function appCall(){
	viewModel();
	ko.applyBindings(locationSearch);
}