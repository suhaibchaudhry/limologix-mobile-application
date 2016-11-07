'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:requestScreenCtrl
 * @description
 * # requestScreenCtrl
 * Controller of the LimoCordova
 */
app
    .controller('requestScreenCtrl', ['$scope', '$rootScope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider', 'driverLocationConstants', 'Faye', '$location', 'MapServices',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider, driverLocationConstants, Faye, $location, MapServices) {
            setTimeout(function() {
                var fixedDivs = jQuery('header').innerHeight() + jQuery('footer').innerHeight() + jQuery('.fixed-head').innerHeight() + jQuery('.fixed-footer').innerHeight();
                var mapHeight = jQuery(window).innerHeight() - fixedDivs - 20;
                // console.log(jQuery('header').outerHeight(),jQuery('footer').innerHeight());
                jQuery(".dvMap_circle").height(mapHeight);
                jQuery(".dvMap_circle").width(mapHeight);
                // Do something after 1 second 
            }, 1000);

            // get Customer route directions
            $scope.tripsummary = {};
            $rootScope.isAdsShow = false;
            $scope.isAccepted = false;
            $scope.cntrlName = 'notification';
             $scope.address_type = "notification";
              //MapServices.cntrlScope = $scope;
            getCustomerRoute();

            $scope.$watchGroup(['cntrlName','tripsummary','address_type'], function(){
                MapServices.cntrlName = $scope.cntrlName;
                MapServices.tripsummary = $scope.tripsummary;
                 MapServices.address_type = $scope.address_type;

            })

            //dispatchRideProvider.getRoutes('', $scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify, false, '', 'dvMap_requestscreen');

            function getCustomerRoute() {
                var stored_notification = JSON.parse(localStorage.getItem("notificationInfo"));
                $scope.tripsummary = {
                    pickupAt: driverLocationConstants.location.start_destination,
                    dropoffAt: driverLocationConstants.location.end_destination,
                    customer_name: driverLocationConstants.location.customer_name,
                    company_name: driverLocationConstants.location.company_name,
                    price: "$" + (driverLocationConstants.location.price),
                    trip_id: driverLocationConstants.location.id,
                    source_place_id: driverLocationConstants.location.source_place_id, 
                    destination_place_id: driverLocationConstants.location.destination_place_id
                };

                // $scope.tripsummary = {
                //     pickupAt: driverLocationConstants ? driverLocationConstants.location.start_destination : stored_notification.start_destination,
                //     dropoffAt: driverLocationConstants ? driverLocationConstants.location.end_destination : stored_notification.end_destination,
                //     customer_name: driverLocationConstants ? driverLocationConstants.location.customer_name : stored_notification.customer_name,
                //     company_name: driverLocationConstants ? driverLocationConstants.location.company_name : stored_notification.company_name,
                //     price: "$" + (driverLocationConstants ? driverLocationConstants.location.price : stored_notification.price),
                //     trip_id: driverLocationConstants ? driverLocationConstants.location.id : stored_notification.id,
                //     source_place_id: driverLocationConstants ? driverLocationConstants.location.source_place_id : stored_notification.source_place_id, 
                //     destination_place_id: driverLocationConstants ? driverLocationConstants.location.destination_place_id : stored_notification.destination_place_id
                // };


                console.log('price', $scope.tripsummary.price, driverLocationConstants.location.price)
                MapServices.init('dvMap_requestscreen');
                //  MapServices.getCurrentPositions();
                // MapServices.getCurrentPositions($scope).then(function() {
                // MapServices.addDirectionRoutes('notification', '', $scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt);
                //     MapServices.watchPositions();
                // }, function(error) {
                //     console.log(error);
                // });
            }

            //getChannelName();

            function getChannelName() {
                var url = appSettings.serverPath + appSettings.serviceApis.getChannelName;
                services.funcGetRequest(url).then(function(response, status) {
                    $scope.channelName = response.data.channel;
                }, function(error) {
                    notify.closeAll();
                });
            }


            $("#progressCountdown").progressbar({ value: 0 });

            var value = 112;

            countdown();

            function countdown() {
                value = value - 8;
                $("#progressCountdown").progressbar("option", "value", value);
                $("#statusCountdown").text(value / 8);

                if (value > 0) {
                    //setTimeout(countdown, 1000);
                    $scope.callTimeout = setTimeout(countdown, 1000);
                } else {
                    $state.go("core.home");

                }
            }

            $scope.trip_accept = function() {
                clearInterval($scope.callTimeout);

                $scope.trip = {
                    id: $scope.tripsummary.trip_id
                }

                $scope.isAccepted = true;
                var url = appSettings.serverPath + appSettings.serviceApis.tripAccept;
                services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response, status) {
                    $state.go('core.passenger_boarded');

                }, function(error) {
                    notify.closeAll();
                    notify({ classes: 'alert-danger', message: error.message });
                    $state.go('core.home');
                });
            }

            $scope.trip_deny = function() {
                $scope.trip = {
                    id: $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.tripDeny;
                services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response, status) {
                    notify.closeAll();
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.home');
                }, function(error) {
                    notify.closeAll();
                    notify({ classes: 'alert-danger', message: error.message });
                    $state.go('core.home');
                });
            }


            // onSuccess Callback
            // This method accepts a Position object, which contains the
            // current GPS coordinates
            //if (navigator.geolocation) {
            var onSuccess = function(position) {
                //faye(Faye,$scope,$window,position);                    
            };

            // onError Callback receives a PositionError object
            function onError(error) {
                //alert('code: ' + error.code + '\n' +
                // 'message: ' + error.message + '\n');
            }

            //navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

            //navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 })

            function faye(Faye, $scope, $window, position) {
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

                //update marker position
                // $scope.marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                // var center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                // $scope.map.setCenter(center);

                var publication = client.publish('/publish/' + $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });

                publication.callback(function() {
                    //alert('Connection established successfully.');
                });
                publication.errback(function(error) {
                    // alert('There was a problem: ' + error.message);
                });
            }
        }
    ])