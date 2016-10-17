'use strict';


app.service('MapServices', ['$q', '$rootScope', 'Faye', 'appSettings', 'services', funMapService]);

function funMapService($q, $rootScope, Faye, appSettings, services) {
    this.map;
    this.marker;
    this.channelName;
    var self = this;
    alert('map service')
    this.init = function() {
        var options = {
            center: new google.maps.LatLng(29.7630556, -95.3630556),
            zoom: 13,
            disableDefaultUI: true
        }
        self.map = new google.maps.Map(
            document.getElementById("dvMap"), options
        );
        self.places = new google.maps.places.PlacesService(self.map);
        self.addMarker();
    }

    this.addMarker = function() {
        if (self.marker) self.marker.setMap(null);
        var geolocate = new google.maps.LatLng(29.7630556, -95.3630556);
        self.marker = new google.maps.Marker({
            map: self.map,
            position: geolocate,
            animation: google.maps.Animation.DROP,
            icon: 'images/driver/location_ping.0b6a1b43.png'
        });
        self.map.setCenter(geolocate);
    }

    this.getCurrentPositions = function() {
        //Event listener when location services on/off
        cordova.plugins.diagnostic.registerLocationAuthorizationStatusChangeHandler(function(status) {
            console.log("home page-  \"not_determined\" to: " + status);
            if (status == 'denied' || status == "not_determined") {
                swal({
                        title: 'Location Service',
                        text: 'Turn on your GPS',
                        type: "warning",
                        confirmButtonText:'Settings'
                    },
                    function() {
                        cordova.plugins.diagnostic.switchToSettings();
                    })
                
            } else {
                self.getCurrentPositions();
                self.watchPositions();
            }
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log('positions', position.coords.latitude, position.coords.longitude);
                var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    center: LatLng,
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                self.map.setCenter(LatLng);
                self.marker.setPosition(LatLng);
                self.getChannelToPublish(position);
                //self.watchPositions();

            });
        } else {
            alert('Geo Location feature is not supported in this browser.');
        }
    }


    this.watchPositions = function() {
        //Event listener when location services on/off
        cordova.plugins.diagnostic.registerLocationAuthorizationStatusChangeHandler(function(status) {
            console.log("home page-  \"not_determined\" to: " + status);
            if (status == 'denied' || status == "not_determined") {
                  swal({
                        title: 'Location Service',
                        text: 'Turn on your GPS',
                        type: "warning",
                        confirmButtonText:'Settings'
                    },
                    function() {
                        cordova.plugins.diagnostic.switchToSettings();
                    })
            } else {
                self.getCurrentPositions();
                self.watchPositions();
            }
        });
        if (navigator.geolocation) {
            self.watchID = navigator.geolocation.watchPosition(self.onSuccess, self.onError, { maximumAge: 3000000, timeout: 3000, enableHighAccuracy: true })
        }
    }

    this.onSuccess = function(position) {
        //update marker position
        if (self.marker && self.map) {
            self.marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(center);
        }
        self.sendLocationsToServerThroughFaye(position);
        //faye(Faye, $scope, $window, position);
    };

    // onError Callback receives a PositionError object
    this.onError = function(error) {
        //alert('code: ' + error.code + '\n' +
        //  'message: ' + error.message + '\n');
    }

    this.destroyWatchId = function(error) {
        navigator.geolocation.clearWatch(self.watchID);
        self.watchID = null;
    }

    this.getChannelToPublish = function(position) {
        var url = appSettings.serverPath + appSettings.serviceApis.getChannelName;
        services.funcGetRequest(url).then(function(response, status) {
            self.channelName = response.data.channel;
            self.sendLocationsToServerThroughFaye(position);
        }, function(error) {
            notify({ classes: 'alert-danger', message: error.message });
        });
    }


    this.sendLocationsToServerThroughFaye = function(p) {
        var Logger = {
            incoming: function(message, callback) {
                console.log('incoming home page', message);
                callback(message);
            },
            outgoing: function(message, callback) {
                message.ext = message.ext || {};
                //message.ext.auth_token = $window.sessionStorage['Auth-Token'];
                message.ext.user_type = "driver";
                console.log('outgoing home page', message);
                callback(message);
            }
        };

        var client = Faye.getClient();
        var isUserlogedIn = localStorage.getItem('isLoggedIn');
        if (self.channelName && isUserlogedIn == 'true') {

            var publication = client.publish('/publish/' + self.channelName, { latitude: p.coords.latitude, longitude: p.coords.longitude });
            client.addExtension(Logger);
            publication.callback(function() {
                //alert('Connection established successfully.');
            });
            publication.errback(function(error) {
                // alert('There was a problem: ' + error.message);
            });

        }
    }

    this.addDirectionRoutes = function(address_type) {
            var source, destination;
            var directionsDisplay;
            var directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: "#9ACD32",
                    strokeWeight: 5
                }
            });
            directionsDisplay.setMap(self.map);
            calcRoute(address_type);

            function calcRoute(address_type) {
                var icons = {
                    start: new google.maps.MarkerImage(
                        'images/source_marker.png',
                        new google.maps.Size(44, 32), //width,height
                        new google.maps.Point(0, 0), // The origin point (x,y)
                        new google.maps.Point(22, 32)),
                    end: new google.maps.MarkerImage(
                        'images/destination_marker.png',
                        new google.maps.Size(44, 32),
                        new google.maps.Point(0, 0),
                        new google.maps.Point(22, 32))
                };

                var start = 'Marathahalli, Bengaluru, Karnataka 560037, India';
                var end = 'Hebbal, Bengaluru, Karnataka 560024, India';
                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        var leg = response.routes[0].legs[0];
                        makeSourceMarker(leg.start_location, icons.start, start, self.map, address_type);
                        makeDestinationMarker(leg.end_location, icons.end, end, self.map, address_type);
                    }
                });
            }

            function makeSourceMarker(position, icon, title, map, address_type) {
                var marker_pickup = new google.maps.Marker({
                    position: position,
                    map: self.map,
                    icon: icon,
                    title: "<div><img border='0' align='Left' width='100%' src='images/driver/popup.png'></img><p class = 'pickUpText'>" + title + "</p></div>"
                });
                self.map.setCenter(marker_pickup);
                if (address_type == "pickup")
                    pickupInfoWindow(marker_pickup, marker_pickup.title);
            }

            function makeDestinationMarker(position, icon, title, map) {
                var marker_dropoff = new google.maps.Marker({
                    position: position,
                    map: self.map,
                    icon: icon,
                    title: "<div><img border='0' align='Left' width='100%' src='images/driver/popup.png'></img><p class = 'pickUpText'>" + title + "</p></div>"
                });
                self.map.setCenter(marker_dropoff);
                if (address_type == "dropoff")
                    dropoffInfoWindow(marker_dropoff, marker_dropoff.title);
            }

            function pickupInfoWindow(marker_pickup, title) {
                var infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(title);
                infoWindow.open(self.map, marker_pickup);
                google.maps.event.addListener(marker_pickup, "click", function(e) {
                    infoWindow.setContent(title);
                    infoWindow.open(self.map, marker_pickup);
                });

            }

            function dropoffInfoWindow(marker_dropoff, title) {
                var infoWindow = new google.maps.InfoWindow();
                infoWindow.setContent(title);
                infoWindow.open(self.map, marker_dropoff);
                google.maps.event.addListener(marker_dropoff, "click", function(e) {
                    infoWindow.setContent(title);
                    infoWindow.open(self.map, marker_dropoff);
                });

            }
        }
        //return this;

};