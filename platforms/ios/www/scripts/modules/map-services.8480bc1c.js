'use strict';


app.service('MapServices', ['$q', '$rootScope', 'Faye', 'appSettings', 'services', funMapService]);

function funMapService($q, $rootScope, Faye, appSettings, services) {
    this.map;
    this.marker;
    this.channelName;
    this.currentLocation;
    this.cntrlScope;
    var self = this;
    alert('map service')
    this.init = function(mapId, cntrlScope) {
        self.mapId = mapId;
        var options = {
            center: new google.maps.LatLng(29.7630556, -95.3630556),
            zoom: 13,
            disableDefaultUI: true
        }
        self.map = new google.maps.Map(
            document.getElementById(mapId), options
        );

        self.places = new google.maps.places.PlacesService(self.map);
        self.addMarker();
        self.getCurrentPositions(cntrlScope);
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

    this.getCurrentPositions = function(cntrlScope) {
        self.cntrlScope = cntrlScope;
        console.log('getCurrentPositions', self.cntrlScope);
        //Event listener when location services on/off
        cordova.plugins.diagnostic.registerLocationAuthorizationStatusChangeHandler(function(status) {
            console.log("home page-  \"not_determined\" to: " + status);
            if (status == 'denied' || status == "not_determined") {
                swal({
                        title: 'GPS',
                        text: 'Turn On Location Services to allow "LimoLogix" to determine your location',
                        type: "info",
                        confirmButtonText: 'Settings'
                    },
                    function() {
                        cordova.plugins.diagnostic.switchToSettings();
                    })

            } else {
                self.getCurrentPositions(self.cntrlScope);
                self.watchPositions();
            }
        });

        if (navigator.geolocation) {
            var deferred = $q.defer();
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log('positions', position.coords.latitude, position.coords.longitude);
                var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    center: LatLng,
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                self.map = new google.maps.Map(document.getElementById(self.mapId), mapOptions);
                if (self.marker) self.marker.setMap(null);
               // var geolocate = new google.maps.LatLng( position.coords.latitude, position.coords.longitude);
                self.marker = new google.maps.Marker({
                    map: self.map,
                    position: LatLng,
                    animation: google.maps.Animation.DROP,
                    icon: 'images/driver/location_ping.0b6a1b43.png'
                });

                self.getLocationAddressByPositions(LatLng); // Get address name by positions for google navigator               

                self.map.setCenter(LatLng);
                self.marker.setPosition(LatLng);
                self.getChannelToPublish(position);
                self.watchPositions();
                deferred.resolve();


            });
        } else {
            alert('Geo Location feature is not supported in this browser.');
            deferred.reject();
        }
        return deferred.promise;
    }

    this.getLocationAddressByPositions = function(LatLng) {
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({
                'latLng': LatLng
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("driver current location = ", results[0].formatted_address);
                    self.currentLocation = results[0].formatted_address;
                    if(self.cntrlScope.tripsummary)
                      self.addDirectionRoutes(self.cntrlScope.address_type, self.current_location, self.cntrlScope.tripsummary.pickupAt, self.cntrlScope.tripsummary.dropoffAt);
                }
            });
        }
    }


    this.watchPositions = function() {
        //Event listener when location services on/off
        cordova.plugins.diagnostic.registerLocationAuthorizationStatusChangeHandler(function(status) {
            console.log("home page-  \"not_determined\" to: " + status);
            if (status == 'denied' || status == "not_determined") {
                swal({
                        title: 'GPS',
                        text: 'Turn On Location Services to allow "LimoLogix" to determine your location',
                        type: "info",
                        confirmButtonText: 'Settings'
                    },
                    function() {
                        cordova.plugins.diagnostic.switchToSettings();
                    })
            } else {
                self.getCurrentPositions(self.cntrlScope);
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
            //self.map.setCenter(center);
        }
        self.sendLocationsToServerThroughFaye(position);
        console.log('self.cntrlScope', self.cntrlScope)
            if (self.cntrlScope.tripsummary)
                self.checkLocationReached(position);
            // if(self.cntrlScope.cntrlName != "notification")
            //    self.checkLocationReached(position);
    };
    this.checkLocationReached = function(position) {
        var p1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //driver current location

        if (self.cntrlScope.cntrlName == "Boarded") {
            var p2 = new google.maps.LatLng(self.cntrlScope.tripsummary.pickupAtLat, self.cntrlScope.tripsummary.pickupAtLng); //pickup location
            var swal_title = "Boarded";
            if (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) < 500) {
                //alert('reached') //within 1/2km 
                swal({
                    title: swal_title,
                    text: 'You are close to' + self.cntrlScope.cntrlName + ' ' + 'location',
                    type: "success"
                }, function() {
                    self.destroyWatchId();
                    //navigator.geolocation.clearWatch($scope.googleposition_id);

                })
                if (self.cntrlScope.cntrlName == "Boarded") {
                    $('#boardedBtn').addClass('buttonBoarded');
                    self.cntrlScope.bool.isBoardedBtnVisible = true;
                } else {
                    $('#arrivedBtn').addClass('buttonArrived');
                    self.cntrlScope.bool.isArrived = true;
                }

                // if (!$scope.$$phase) {
                //     $scope.$digest();
                // };                   
            } else {
                // alert('out of radius')                    

            }
            // console.log("p1 and p2 = boarded", p1, p2, google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
        }
        // else{
        //    var p2 = new google.maps.LatLng(self.cntrlScope.tripsummary.dropoffAtLat, self.cntrlScope.tripsummary.dropoffAtLng);//dropoff location
        //    var swal_title = "Arrived"
        //    //console.log("p1 and p2 = arrived", p1, p2, google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
        // }



    }

    // onError Callback receives a PositionError object
    this.onError = function(error) {
        //alert('code: ' + error.code + '\n' +
        //  'message: ' + error.message + '\n');
    }

    this.destroyWatchId = function() {
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

    this.addDirectionRoutes = function(address_type, current_location, start, end) {
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
        calcRoute(address_type, start, end, directionsService);

        function calcRoute(address_type, start, end, directionsService) {
            var icons = {
                start: new google.maps.MarkerImage(
                    'images/source_marker.9db0b1d4.png',
                    new google.maps.Size(44, 32), //width,height
                    new google.maps.Point(0, 0), // The origin point (x,y)
                    new google.maps.Point(22, 32)),
                end: new google.maps.MarkerImage(
                    'images/destination_marker.23597b9e.png',
                    new google.maps.Size(44, 32),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(22, 32))
            };

            self.start_point = start; //'Marathahalli, Bengaluru, Karnataka 560037, India';
            self.end_point = end; //'Hebbal, Bengaluru, Karnataka 560024, India';
            var request = {
                origin: self.start_point,
                destination: self.end_point,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var leg = response.routes[0].legs[0];
                    self.makeSourceMarker(leg.start_location, icons.start, self.start_point, self.map, address_type);
                    self.makeDestinationMarker(leg.end_location, icons.end, self.end_point, self.map, address_type);
                }
            });
        }

    }
    this.makeSourceMarker = function(position, icon, pickup_point, map, address_type) {
        var marker_pickup = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            title: "<div>" +
                "<img border='0' id='infoWindowid' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img>" +
                "<a href ='http://maps.google.com/maps?saddr=" + self.currentLocation + "&amp;daddr=" + pickup_point + "'class = ''><img src='images/driver/nav-icon.1a509916.png' class = 'nav-icon1'/></a>" +
                "<a href ='http://maps.google.com/maps?saddr=" + self.currentLocation + "&amp;daddr=" + pickup_point + "'class = 'pickUpText'>" + pickup_point + "</p></div>"
                //"<div><img border='0' align='Left' width='100%' src='images/driver/popup.png'></img><p class = 'pickUpText'>" + title + "</p></div>"
        });
        map.setCenter(position);
        if (address_type == "pickup")
            self.pickupInfoWindow(marker_pickup, marker_pickup.title);
    }

    this.makeDestinationMarker = function(position, icon, dropoff_point, map, address_type) {
        var marker_dropoff = new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            title: "<div>" +
                "<img border='0' id='infoWindowid' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img>" +
                "<a href ='http://maps.google.com/maps?saddr=" + self.currentLocation + "&amp;daddr=" + dropoff_point + "'class = ''><img src='images/driver/nav-icon.1a509916.png' class = 'nav-icon1'/></a>" +
                "<a href ='http://maps.google.com/maps?saddr=" + self.currentLocation + "&amp;daddr=" + dropoff_point + "'class = 'pickUpText'>" + dropoff_point + "</p></div>"
        });
        map.setCenter(position);
        if (address_type == "dropoff")
            self.dropoffInfoWindow(marker_dropoff, marker_dropoff.title);
    }

    this.pickupInfoWindow = function(marker_pickup, title) {
        var infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(title);
        infoWindow.open(self.map, marker_pickup);
        google.maps.event.addListener(marker_pickup, "click", function(e) {
            infoWindow.setContent(title);
            infoWindow.open(self.map, marker_pickup);
        });

    }

    this.dropoffInfoWindow = function(marker_dropoff, title) {
        var infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(title);
        infoWindow.open(self.map, marker_dropoff);
        google.maps.event.addListener(marker_dropoff, "click", function(e) {
            infoWindow.setContent(title);
            infoWindow.open(self.map, marker_dropoff);
        });

    }

    // this.getRoutes = function(currLoc,pickup, dropoff, notify,isInfoWindowVisible,check_infoWindow,map_ele_id) {
    //                var self = this;
    //                var source, destination;
    //                var directionsDisplay;
    //                var directionsService = new google.maps.DirectionsService();
    //                directionsDisplay = new google.maps.DirectionsRenderer({
    //                    suppressMarkers: true,
    //                    polylineOptions: {
    //                        strokeColor: "#9ACD32",
    //                        strokeWeight: 5
    //                    }
    //                });
    //                var icons = {
    //                    start: new google.maps.MarkerImage(
    //                        'images/source_marker.9db0b1d4.png',
    //                        new google.maps.Size(44, 32), //width,height
    //                        new google.maps.Point(0, 0), // The origin point (x,y)
    //                        new google.maps.Point(22, 32)),
    //                    end: new google.maps.MarkerImage(
    //                        'images/destination_marker.23597b9e.png',
    //                        new google.maps.Size(44, 32),
    //                        new google.maps.Point(0, 0),
    //                        new google.maps.Point(22, 32))
    //                };
    //                navigator.geolocation.getCurrentPosition(function(p) {
    //                    var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
    //                    var mapOptions = {
    //                        center: LatLng,
    //                        zoom: 13,
    //                        mapTypeId: google.maps.MapTypeId.ROADMAP
    //                    };
    //                    //var map = new google.maps.Map(document.getElementById('dvMap'));

    //                   self.map = new google.maps.Map(document.getElementById(map_ele_id), mapOptions);
    //                   self.marker = new google.maps.Marker({
    //                        position: LatLng,
    //                        map: self.map,
    //                        icon: 'images/driver/location_ping.0b6a1b43.png',
    //                        title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
    //                    });
    //                    directionsDisplay.setMap(self.map);

    //                    source = pickup;
    //                    destination = dropoff;

    //                    var request = {
    //                        origin: source,
    //                        destination: destination,
    //                        travelMode: google.maps.TravelMode.DRIVING
    //                    };
    //                    directionsService.route(request, function(response, status) {
    //                        if (status == google.maps.DirectionsStatus.OK) {
    //                            directionsDisplay.setDirections(response);
    //                            var leg = response.routes[0].legs[0];
    //                            if(!isInfoWindowVisible){
    //                                makeMarker(leg.start_location, icons.start, source, self.map);
    //                                makeMarker(leg.end_location, icons.end, destination, self.map);
    //                            }else{
    //                               // makeMarker_source(leg.start_location, icons.start, source, self.map,check_infoWindow);
    //                               // makeMarker_destination(leg.end_location, icons.end, destination, self.map,check_infoWindow);
    //                            }

    //                        } else {
    //                            // notify({ classes: 'alert-error', message: 'unable to retrive route' });
    //                        }
    //                    });
    //                });

    //                //*********DIRECTIONS AND ROUTE**********************//


    //                function makeMarker_source(position, icon, title, map,check_infoWindow) {

    //                    var pickup_point= pickup;
    //                    var marker_pickup = new google.maps.Marker({
    //                        position: position,
    //                        map: map,
    //                        icon: icon,
    //                        //title: (check_infoWindow == "pickuppoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><a href = 'http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + pickup_point + "'class = 'pickUpText'>" + pickup_point + "</p></div>" : title
    //                        title: (check_infoWindow == "pickuppoint") ? "<div>"+
    //                        "<img border='0' id='infoWindowid' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img>"+
    //                        "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + pickup_point + "'class = ''><img src='images/driver/nav-icon.1a509916.png' class = 'nav-icon1'/></a>"+
    //                        "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + pickup_point + "'class = 'pickUpText'>" + pickup_point + "</p></div>" : title
    //                        //title: (check_infoWindow == "pickuppoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><a href ='http://maps.google.com/maps?saddr="+pickup+"&amp;daddr="+dropoff+"&amp;ll="+"kalyannagar"+"' class = 'pickUpText'>" + pickup + "</p></div>" : title
    //                        //title: (check_infoWindow == "pickuppoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><p class = 'pickUpText'>" + pickup + "</p></div>" : title
    //                    });
    //                    if(check_infoWindow == "pickuppoint"){
    //                        var infoWindow = new google.maps.InfoWindow();
    //                         infoWindow.setContent(marker_pickup.title);
    //                         infoWindow.open(map, marker_pickup);
    //                         google.maps.event.addListener(marker_pickup, "click", function(e) {
    //                              infoWindow.setContent(marker_pickup.title);
    //                              infoWindow.open(map, marker_pickup);
    //                         });
    //                    }

    //                }
    //                function makeMarker_destination(position, icon, title, map,check_infoWindow) {
    //                    var marker_dropoff = new google.maps.Marker({
    //                        position: position,
    //                        map: map,
    //                        icon: icon,
    //                        //title: (check_infoWindow == "dropoffpoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + dropoff + "'class = 'pickUpText'>" + dropoff + "</p></div>" : title
    //                         title: (check_infoWindow == "dropoffpoint") ? "<div>"+
    //                        "<img border='0' id='infoWindowid' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img>"+
    //                        "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + dropoff + "'class = ''><img src='images/driver/nav-icon.1a509916.png' class = 'nav-icon2'/></a>"+
    //                        "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + dropoff + "'class = 'pickUpText'>" + dropoff + "</p></div>" : title
    //                        //title: (check_infoWindow == "dropoffpoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><p class = 'pickUpText'>" + dropoff + "</p></div>" : title
    //                    });
    //                     if(check_infoWindow == "dropoffpoint"){  
    //                         var infoWindow = new google.maps.InfoWindow();
    //                         infoWindow.setContent(marker_dropoff.title);
    //                         infoWindow.open(map, marker_dropoff);
    //                         google.maps.event.addListener(marker_dropoff, "click", function(e) {
    //                              infoWindow.setContent(marker_dropoff.title);
    //                              infoWindow.open(map, marker_dropoff);
    //                         });
    //                     }

    //                }
    //                function makeMarker(position, icon, title, map) {
    //                    new google.maps.Marker({
    //                        position: position,
    //                        map: map,
    //                        icon: icon,
    //                        title: title
    //                    });
    //                }
    //            }
    //return this;

};