'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:passengerArrivedCtrl
 * @description
 * # passengerArrivedCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('passengerArrivedCtrl', ['$scope', '$rootScope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider', 'Faye', '$location', 'driverLocationConstants',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider, Faye, $location, driverLocationConstants) {

            $scope.tripsummary = {};
            $rootScope.isAdsShow = false;
            $scope.bool = {};
            $scope.cntrlName = "Arrived";
            $scope.address_type = "dropoff";
            $scope.bool.isArrived = false;
            getCustomerRoute();
            //clearInterval($rootScope.getLoc);

            var map_height = jQuery(window).innerHeight() - (jQuery('.b2').innerHeight() + jQuery('.navbar-header').innerHeight())

            jQuery('#dvMap_arrived').height(map_height);

            function getCustomerRoute() {
                //    $scope.tripsummary.pickupAt = 'Marathahalli, Bengaluru, Karnataka 560037, India';
                //    $scope.tripsummary.dropoffAt = 'Hebbal, Bengaluru, Karnataka 560024, India';
                //    $scope.tripsummary.trip_id = 3;
                $scope.tripsummary = {

                    pickupAt: driverLocationConstants.location.start_destination,
                    pickupAtLat: driverLocationConstants.location.start_destination_lat,
                    pickupAtLng: driverLocationConstants.location.start_destination_lng,

                    dropoffAt: driverLocationConstants.location.end_destination,
                    dropoffAtLat: driverLocationConstants.location.end_destination_lat,
                    dropoffAtLng: driverLocationConstants.location.end_destination_lng,

                    trip_id: driverLocationConstants.location.id
                };

                MapServices.init('dvMap_arrived',$scope);
                // MapServices.getCurrentPositions($scope).then(function() {
                //     MapServices.addDirectionRoutes('dropoff', '', $scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt);
                //     //Mapservices.getDropoffLatLng($scope.tripsummary.dropoffAtLat, $scope.tripsummary.dropoffAtLng, $scope);
               MapServices.watchPositions();
                // }, function(error) {
                //     console.log(error);
                // });
            }




            var options = {
                maximumAge: 3600000,
                timeout: 3000,
                enableHighAccuracy: true,
            }

            navigator.geolocation.getCurrentPosition(getCurrentPosition, onError, options)

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
                            dispatchRideProvider.getRoutes($scope.currentLocation, $scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify, true, 'dropoffpoint', 'dvMap_arrived');

                            //dispatchRideProvider.getRoutes($scope.currentLocation,$scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'pickuppoint','dvMap_boarded');

                            // dispatchRideProvider.getRoutes($scope.currentLocation, $scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify, true, 'pickuppoint');
                        }
                    });
                }

            }

            // var options = {
            //     maximumAge: 3000000,
            //     timeout: 3000,
            //     enableHighAccuracy: true,
            // }


            $scope.googlepositionDest_id = navigator.geolocation.watchPosition(onSuccess, onError, options)



            // getChannelName();
            //   function getChannelName(){
            //     var url = appSettings.serverPath + appSettings.serviceApis.getChannelName;
            //       services.funcGetRequest(url).then(function(response,status) {
            //        $scope.channelName = response.data.channel;                     
            //       },function(error){
            //            //notify({ classes: 'alert-danger', message: error.message });
            //       });
            //   }

            // onSuccess Callback
            // This method accepts a Position object, which contains the
            // current GPS coordinates
            //if (navigator.geolocation) {
            function onSuccess(position) {
                console.log("position", position);

                //update marker position
                if (dispatchRideProvider.map && dispatchRideProvider.marker) {
                    dispatchRideProvider.marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    dispatchRideProvider.map.setCenter(center);
                }


                //faye(Faye, $scope, $rootScope, $window, position);

                var p1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var p2 = new google.maps.LatLng($scope.tripsummary.dropoffAtLat, $scope.tripsummary.dropoffAtLng);
                //alert('destination distance',google.maps.geometry.spherical.computeDistanceBetween(p1, p2))
                if (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) < 500) {
                    swal({
                        title: 'Arrived!',
                        text: 'You are close to dropoff location',
                        type: "success"
                    }, function() {
                        navigator.geolocation.clearWatch($scope.googlepositionDest_id);
                    })
                    $('#arrivedBtn').addClass('buttonArrived');
                    $scope.bool.isArrived = true;
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    };

                } else {
                    // alert('dest-out of radius')
                    // $('#arrivedBtn').removeClass('buttonArrived'); 
                    // $scope.isArrived = false;

                }

            }

            $scope.$watch('bool', function() {
                //alert('digest');              
            }, true)

            // onError Callback receives a PositionError object
            function onError(error) {
                //alert('code: ' + error.code + '\n' +
                // 'message: ' + error.message + '\n');
            }

            $scope.passenger_arrived = function() {
                navigator.geolocation.clearWatch($scope.googlepositionDest_id);
                //$state.go('core.passenger_arrived');
                $scope.trip = {
                    id: $scope.tripsummary.trip_id
                }

                //if ($rootScope.online) {
                    var url = appSettings.serverPath + appSettings.serviceApis.passengerArrived;
                    services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response) {
                        notify.closeAll();
                        notify({ classes: 'alert-success', message: response.message });
                        $state.go('core.home');
                    }, function(error) {
                        notify.closeAll();
                        notify({ classes: 'alert-danger', message: error });
                        $state.go('core.home');
                    });

                    $scope.bool.isArrived = false;
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    };
                // } else {
                //     alert('The internet connection appears to be offline');
                // }

            }



            function faye(Faye, $scope, $rootScope, $window, position) {
                var Logger = {
                    incoming: function(message, callback) {
                        //  console.log('incoming', message);
                        callback(message);
                    },
                    outgoing: function(message, callback) {
                        message.ext = message.ext || {};
                        message.ext.auth_token = $window.sessionStorage['Auth-Token'];
                        message.ext.user_type = "driver";
                        //console.log('outgoing', message);
                        callback(message);
                    }
                };
                var client = Faye.getClient();
                client.addExtension(Logger);


                if ($rootScope.channelName) {
                    var publication = client.publish('/publish/' + $rootScope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });

                    publication.callback(function() {
                        //alert('Connection established successfully.');
                    });
                    publication.errback(function(error) {
                        // alert('There was a problem: ' + error.message);
                    });

                }

            }

        }
    ])