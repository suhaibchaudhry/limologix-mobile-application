'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:passengerBoardedCtrl
 * @description
 * # passengerBoardedCtrl
 * Controller of the LimoCordova
 */
app
    .controller('passengerBoardedCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider','driverLocationConstants','Faye','$location',
        function($scope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider,driverLocationConstants,Faye,$location) {
                        
            $scope.tripsummary = {};
            $scope.isBoarded =false;
            getCustomerRoute();
            //dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'pickuppoint','dvMap_boarded');
            
            var map_height = jQuery(window).innerHeight() - (jQuery('.b1').innerHeight() + jQuery('.navbar-header').innerHeight())
            jQuery('#dvMap_boarded').height(map_height);
            
            function getCustomerRoute() {
                console.log('helloo',driverLocationConstants.location)
               // $scope.tripsummary.pickupAt = 'Marathahalli, Bengaluru, Karnataka 560037, India';
               // $scope.tripsummary.dropoffAt = 'Hebbal, Bengaluru, Karnataka 560024, India';
               // $scope.tripsummary.trip_id = 3;


               $scope.tripsummary = {

                    pickupAt : driverLocationConstants.location.start_destination,
                    pickupAtLat : driverLocationConstants.location.start_destination.latitude,
                    pickupAtLng: driverLocationConstants.location.start_destination.longitude,

                    dropoffAt : driverLocationConstants.location.end_destination,
                    dropoffAtLat: driverLocationConstants.location.end_destination.latitude,
                    dropoffAtLng: driverLocationConstants.location.end_destination.longitude,

                    trip_id: driverLocationConstants.location.id
                };
                
            }

            var options = {
              maximumAge: 3600000,
              timeout: 3000,
              enableHighAccuracy: true,
           }

            navigator.geolocation.getCurrentPosition(getCurrentPosition,onError,options)

            function getCurrentPosition(position) {
                console.log('driver at', position);
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var geocoder = new google.maps.Geocoder();
                if (geocoder) {
                    geocoder.geocode({
                        'latLng': latlng
                    }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            console.log("driver place= ", results[0].formatted_address);
                            $scope.currentLocation = results[0].formatted_address;
                            dispatchRideProvider.getRoutes($scope.currentLocation,$scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'pickuppoint','dvMap_boarded');
 
                           // dispatchRideProvider.getRoutes($scope.currentLocation, $scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify, true, 'pickuppoint');
                        }
                    });
                }

            }

                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //if (navigator.geolocation) {
                function onSuccess(position) {
                  console.log("position", position);

                  var p1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                  var p2 = new google.maps.LatLng($scope.tripsummary.pickupAtLat, $scope.tripsummary.pickupAtLng);
                  if (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) < 1000) {
                      alert('You are close to your location/You have arrived!');
                      $scope.isBoarded = true;
                  }


                    var url = appSettings.serverPath + appSettings.serviceApis.getChannelName;
                    services.funcGetRequest(url).then(function(response,status) {
                      if(response){
                         $scope.channelName = response.data.channel;
                         faye(Faye,$scope,$window,position);
                      }
                    
                    },function(error){
                         notify({ classes: 'alert-danger', message: response.message });
                    });
                }

                // onError Callback receives a PositionError object
                function onError(error) {
                    //alert('code: ' + error.code + '\n' +
                    // 'message: ' + error.message + '\n');
                }


              var options = {
                maximumAge: 3600000,
                timeout: 3000,
                enableHighAccuracy: true,
             }

              setInterval(function(){
                navigator.geolocation.watchPosition(onSuccess,onError,options)
              },3000);
                

            $scope.passenger_boarded = function(){
                //$state.go('core.passenger_arrived');
                $scope.trip = {
                   id : $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.passengerBoarded;
                services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.passenger_arrived');
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                    $state.go('core.passenger_arrived');
                });
            }

            function faye(Faye,$scope,$window,position) {
                var Logger = {
                    incoming: function(message, callback) {
                        console.log('incoming', message);
                        callback(message);
                    },
                    outgoing: function(message, callback) {
                        message.ext = message.ext || {};
                        message.ext.auth_token = $window.sessionStorage['Auth-Token'];
                        message.ext.user_type = "driver";
                        console.log('outgoing', message);
                        callback(message);
                    }
                };
                var client = Faye.getClient();
                client.addExtension(Logger);
                var publication = client.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });

                publication.callback(function() {
                    //alert('Connection established successfully.');
                });
                publication.errback(function(error) {
                    // alert('There was a problem: ' + error.message);
                });
            }
        }
])
