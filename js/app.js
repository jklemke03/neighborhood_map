var map;
var markers = ko.observableArray();
var navActive = true;


	  
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
		console.log(self.street);
        self.city = markResult.location.formattedAddress[1] || 'Address Information Not Available';
        self.phone = markResult.contact.phone || 'Phone Information Not Available';
		}).fail(function () {
			alert('There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.');
		});
		

		//sets a default clear contentString
		self.contentString = "";
		
      
        // Puts the content string inside infowindow.
        this.infoWindow = new google.maps.InfoWindow({content: self.contentString});
		this.latLng = new google.maps.LatLng(self.lat(), self.lng());

		
		self.marker = new google.maps.Marker({
            position: self.position(),
            name: self.name(),
            animation: google.maps.Animation.DROP,
			url: self.URL,
			street: self.city,
			phone: self.phone,
			infoWindow: this.infoWindow,
			latLng: this.latLng
			
          });
		
	
		self.marker.addListener('click', function() {
			if (this.getAnimation() !== null) {
				this.setAnimation(null);
			} else {
				this.setAnimation(google.maps.Animation.BOUNCE);
			}
			setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 750);
		});
	
		


       // When marker is clicked on open up infowindow designated to the marker with it's information.
        self.marker.addListener('click', function(){
		self.contentString = '<div class="info-window-content"><div class="title"><b>' + self.name() + "</b></div>" +
        '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content">' + self.phone + "</div></div>";
           self.infoWindow.setContent(self.contentString);
		  self.infoWindow.setPosition(this.latLng);
           self.marker.infoWindow.open(map);
		   
	    });
		
		self.infoWindow.addListener('closeclick', function() {
            self.infoWindow.close();
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

    if (value === '') {
		for (var location in markers()){
			markers()[location].showLocation(true);
			markers()[location].marker.setVisible(true);
		}
	}

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

var selectLocation = function (data, event){
	self = this;
	console.log(data.latLng);
	console.log(data);
	console.log(data.infoWindow);
	self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.marker.name + "</b></div>" +
        '<div class="content"><a href="' + data.URL + '">' + data.URL + "</a></div>" +
        '<div class="content">' + data.street + "</div>" +
        '<div class="content">' + data.city + "</div>" +
        '<div class="content">' + data.phone + "</div></div>";
	data.infoWindow.setContent(self.contentString);
	data.infoWindow.setPosition(data.latLng);
	data.infoWindow.open(map);
	
};


googleError = function googleError() {
    alert(
        'Google Maps did not load. Please refresh the page.'
    );
};

var toggleNav = function(){
	var elem = document.getElementById("map");
	if(navActive === true) {
		navActive = false;
		elem.style.left = "0px";	
	}
	else{
		navActive = true;
		elem.style.left = "362px";
	}
	
	
}

function appCall(){
	viewModel();
	ko.applyBindings(locationSearch);
}