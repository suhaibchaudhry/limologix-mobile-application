'use strict';


app.service('MapServices', ['$q', '$timeout', '$rootScope', 'Faye', 'appSettings', 'services', funMapService]);

function funMapService($q, $timeout, $rootScope, Faye, appSettings, services) {
    this.map = null;
    this.marker;
    this.channelName;
    this.currentLocation;
    this.cntrlScope;
    this.boardedSwal = false;
    this.arrivedSwal = false;
    this.firstLoad = true;
    this.defer = $q.defer();
    var self = this;
    var bgGeo = window.BackgroundGeolocation;

    var callbackFn = function(location, taskId) {
        console.log('Location: ');
        console.log(location);

        if(self.firstLoad) {
          console.log('First location publish');
          console.log(location);
          self.getChannelToPublish(location);
          self.firstLoad = false;
        }
        console.log('calling interval');
        self.locationUpdateInterval(location);
        //}
        // The plugin records multiple samples when doing motionchange events.
        // It sends these to the location callback for you convenience.
        // You might uses these to "progressively" update user's current
        // position on a map, for example.
        if (location.sample) {
            console.log('- Ignore samples');

            // IMPORTANT:  send signal to native code that your callback is complete.
            bgGeo.finish(taskId);
            return;
        }

        // IMPORTANT:  send signal to native code that your callback is
        bgGeo.finish(taskId);
        return;
    };

    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error', error);
        console.log("timeout Location setting is " + (enabled ? "enabled" : "disabled"));
        if (enabled) {
            swal.close();
        } else {
            swal({
                    title: 'GPS',
                    text: 'Turn On Location Services to allow "LimoLogix" to Determine Your Location',
                    type: "info",
                    confirmButtonText: 'Settings',
                    closeOnConfirm: true
                },
                function(isConfirm) {
                    if (isConfirm)
                        cordova.plugins.diagnostic.switchToSettings();
                })
        }
    }

    var isUserLoggedIn = localStorage.getItem('isLoggedIn');
    var AuthToken = localStorage.getItem('Auth-Token');
    var url;
    if (isUserLoggedIn == "true") {
        console.log('Providing Token');
        console.log(AuthToken);
        url = 'http://limologix.softwaystaging.com:9800/?token='+AuthToken;
    } else {
        console.log(AuthToken);
        console.log('Token Access Failed');
        url = 'http://limologix.softwaystaging.com:9800/';
    }

    bgGeo.configure({
        // Geolocation config
        desiredAccuracy: 0,
        stationaryRadius: 50,
        distanceFilter: 50,

        // Activity recognition config
        activityRecognitionInterval: 10000,
        stopTimeout: 5,  // Stop-detection timeout minutes (wait x minutes to turn off tracking)

        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: 5,    // Verbose logging.  0: NONE
        stopOnTerminate: false,              // <-- Don't stop tracking when user closes app.
        startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.

        // HTTP / SQLite config
        url: 'http://limologix.softwaystaging.com:9800/',
        batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
        maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
    }, function(state) {
      // Plugin is configured and ready to use.
      if (!state.enabled) {
        bgGeo.start();  // <-- start-tracking
      }
    });
    /*this.checkGPS = setInterval(function() {
        cordova.plugins.diagnostic.isLocationEnabledSetting(function(enabled) {
            console.log("timeout Location setting is " + (enabled ? "enabled" : "disabled"));
            if (enabled) {
                swal.close();
            } else {
                swal({
                        title: 'GPS',
                        text: 'Turn On Location Services to allow "LimoLogix" to Determine Your Location',
                        type: "info",
                        confirmButtonText: 'Settings',
                        closeOnConfirm: true
                    },
                    function(isConfirm) {
                        if (isConfirm)
                            cordova.plugins.diagnostic.switchToSettings();
                    })
            }
        }, function(error) {
            console.error("The following error occurred: " + error);
        });
    }, 5000)*/


    /*this.getCurrentPositionsWithInterval = setInterval(function() {
        navigator.geolocation.getCurrentPosition(self.onSuccessInterval, self.onErrorInterval);
    }, 3000);*/

    this.init = function(mapId) {
        $("#spinner1").show();
        self.mapId = mapId;
        self.getCurrentPositions();
        console.log('initializing location');
        bgGeo.on('location', callbackFn, failureFn);
    }
    /*
    //Unused
    this.addMarker = function() {
        if (self.marker) self.marker.setMap(null);
        var geolocate = new google.maps.LatLng(29.7630556, -95.3630556);
        self.marker = new google.maps.Marker({
            map: self.map,
            position: geolocate,
            //animation: google.maps.Animation.DROP,
            icon: 'images/driver/location_ping.0b6a1b43.png'
        });
        self.map.setCenter(geolocate);
    }*/

    this.getCurrentPositions = function(position) {
        /*//Event listener when location services on/off
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
                self.getCurrentPositions();
            }
        });

        if (navigator.geolocation) {
            //var deferred = $q.defer();
            navigator.geolocation.getCurrentPosition(function(position) {*/
                console.log('positions', 29.6637309,-95.4892921);
                var LatLng = new google.maps.LatLng(29.6637309,-95.4892921);
                var mapOptions = {
                    center: LatLng,
                    zoom: 13,
                    streetViewControl: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                self.map = new google.maps.Map(document.getElementById(self.mapId), mapOptions);
                google.maps.event.addListenerOnce(self.map, "idle", function() {
                    $("#spinner1").hide();
                });
                if (self.map) {
                    $("#spinner1").hide();
                }
                if (self.marker) self.marker.setMap(null);
                // var geolocate = new google.maps.LatLng( position.coords.latitude, position.coords.longitude);
                self.marker = new google.maps.Marker({
                    map: self.map,
                    position: LatLng,
                    //animation: google.maps.Animation.DROP,
                    icon: 'images/driver/location_ping.0b6a1b43.png'
                });

                self.getLocationAddressByPositions(LatLng); // Get address name by positions for google navigator

                self.map.setCenter(LatLng);
                self.marker.setPosition(LatLng);
                //self.getChannelToPublish();
                // self.watchPositions();
                //deferred.resolve();
        /*    });*/
        /*} else {
            alert('Geo Location feature is not supported in this browser.');
            //deferred.reject();
        }*/
        //return deferred.promise;*/
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
                    console.log('self.address_type,tripsummary', self.tripsummary)
                    if (self.tripsummary)
                        self.addDirectionRoutes(self.address_type, self.current_location, self.tripsummary);
                }
            });
        }
    }

    this.locationUpdateInterval = function(position) {
        //update marker position
        if (self.marker && self.map) {
            self.marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(center);
        }
        var isDriverLoggedIn = localStorage.getItem('isLoggedIn');
        console.log('Sending to Faye');
        console.log(position);
        if (isDriverLoggedIn == 'true') {
            self.sendLocationsToServerThroughFaye(position);
            if (self.address_type == "pickup")
                self.checkLocationReached(position);
            if (self.address_type == "dropoff")
                self.checkLocationReached(position);
        }
    };

    /*// onError Callback receives a PositionError object
    this.onErrorInterval = function(error) {
        //alert('code: ' + error.code + '\n' +
        //  'message: ' + error.message + '\n');
    }*/

    this.checkLocationReached = function(position) {

        var p1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //driver current location
        if (self.cntrlName == "Boarded") {
            var p2 = new google.maps.LatLng(self.tripsummary.pickupAtLat, self.tripsummary.pickupAtLng); //pickup location
            var swal_title = "Boarded";
            if (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) < 500) { //within 1/2km
                $('#boardedBtn').addClass('buttonBoarded');
                self.bool.isBoardedBtnVisible = true;
                $rootScope.$digest();
            } else {
                // alert('out of radius')
            }
        } else if (self.cntrlName == "Arrived") {
            var p2 = new google.maps.LatLng(self.tripsummary.dropoffAtLat, self.tripsummary.dropoffAtLng); //dropoff location
            var swal_title = "Arrived";
            if (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) < 500) {  //within 1/2km
                $('#arrivedBtn').addClass('buttonArrived');
                self.bool.isArrived = true;
                $rootScope.$digest();
            } else {

            }
        } else {

        }
    }

    this.watchBoardedBtn = function() {
        return self.defer.promise;
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
                console.log(message);
            },
            outgoing: function(message, callback) {
                message.ext = message.ext || {};
                //message.ext.auth_token = $window.sessionStorage['Auth-Token'];
                message.ext.user_type = "driver";
                console.log('outgoing home page');
                console.log(message);
                callback(message);
            }
        };

        var msg = { latitude: p.coords.latitude, longitude: p.coords.longitude };
        console.log('Pushing out');
        console.log(msg);
        console.log(self.channelName);
        var client = Faye.getClient();
        var isUserlogedIn = localStorage.getItem('isLoggedIn');
        if (self.channelName && isUserlogedIn === 'true') {
            var publication = client.publish('/publish/' + self.channelName, msg);
            client.addExtension(Logger);
            publication.callback(function() {
                //alert('Connection established successfully.');
            });
            publication.errback(function(error) {
                // alert('There was a problem: ' + error.message);
            });

        }
    }

    this.addDirectionRoutes = function(address_type, current_location, tripsummary) {
        var source, destination;
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var service = new google.maps.places.PlacesService(self.map);
        directionsDisplay.setMap(self.map);
        directionsDisplay.setOptions({ suppressMarkers: true });

        self.start_point = tripsummary.pickupAt;
        self.end_point = tripsummary.dropoffAt;
        var origin_place_id = null;
        var destination_place_id = null;
        var travel_mode = "DRIVING";

        var S_marker = new google.maps.Marker({
            map: self.map,
            anchorPoint: new google.maps.Point(0, -29)
        })

        var D_marker = new google.maps.Marker({
            map: self.map,
            anchorPoint: new google.maps.Point(0, -29)
        })

        //var source_placeDetails, destination_placeDetails;

        var get_source_placeId = tripsummary.source_place_id;
        var get_destination_placeId = tripsummary.destination_place_id;
        service.getDetails({
            placeId: get_source_placeId
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                //source_placeDetails = place;

                S_marker.setIcon( /** @type {google.maps.Icon} */ ({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));
                S_marker.setPosition(place.geometry.location);
                S_marker.setVisible(true);
                origin_place_id = place.place_id;
                route(origin_place_id, destination_place_id, travel_mode,
                    directionsService, directionsDisplay);
            }
        })

        service.getDetails({
            placeId: get_destination_placeId
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                D_marker.setIcon( /** @type {google.maps.Icon} */ ({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));
                D_marker.setPosition(place.geometry.location);
                D_marker.setVisible(true);
                destination_place_id = place.place_id;
                route(origin_place_id, destination_place_id, travel_mode,
                    directionsService, directionsDisplay);
            }

        })



        function route(origin_place_id, destination_place_id, travel_mode,
            directionsService, directionsDisplay) {
            if (!origin_place_id || !destination_place_id) {
                return;
            }
            directionsService.route({
                origin: { 'placeId': origin_place_id },
                destination: { 'placeId': destination_place_id },
                travelMode: travel_mode
            }, function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    var leg = response.routes[0].legs[0];

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
                    self.makeSourceMarker(leg.start_location, icons.start, self.start_point, self.map, address_type);
                    self.makeDestinationMarker(leg.end_location, icons.end, self.end_point, self.map, address_type);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }



        //old///

        // var source, destination;
        // var directionsDisplay;
        // var directionsService = new google.maps.DirectionsService();
        // directionsDisplay = new google.maps.DirectionsRenderer({
        //     suppressMarkers: true,
        //     polylineOptions: {
        //         strokeColor: "#9ACD32",
        //         strokeWeight: 5
        //     }
        // });
        // directionsDisplay.setMap(self.map);
        // calcRoute(address_type, start, end, directionsService);

        // function calcRoute(address_type, start, end, directionsService) {
        //     var icons = {
        //         start: new google.maps.MarkerImage(
        //             'images/source_marker.9db0b1d4.png',
        //             new google.maps.Size(44, 32), //width,height
        //             new google.maps.Point(0, 0), // The origin point (x,y)
        //             new google.maps.Point(22, 32)),
        //         end: new google.maps.MarkerImage(
        //             'images/destination_marker.23597b9e.png',
        //             new google.maps.Size(44, 32),
        //             new google.maps.Point(0, 0),
        //             new google.maps.Point(22, 32))
        //     };

        //     self.start_point = start; //'Marathahalli, Bengaluru, Karnataka 560037, India';
        //     self.end_point = end; //'Hebbal, Bengaluru, Karnataka 560024, India';
        //     var request = {
        //         origin: self.start_point,
        //         destination: self.end_point,
        //         travelMode: google.maps.TravelMode.DRIVING
        //     };
        //     directionsService.route(request, function(response, status) {
        //         if (status == google.maps.DirectionsStatus.OK) {
        //             directionsDisplay.setDirections(response);
        //             var leg = response.routes[0].legs[0];
        //             self.makeSourceMarker(leg.start_location, icons.start, self.start_point, self.map, address_type);
        //             self.makeDestinationMarker(leg.end_location, icons.end, self.end_point, self.map, address_type);
        //         }
        //     });
        // }





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



};