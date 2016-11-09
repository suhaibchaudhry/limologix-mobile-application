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
        'services', 'AppConstants', 'dispatchRideProvider', 'Faye', '$location', 'driverLocationConstants', 'MapServices',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider, Faye, $location, driverLocationConstants, MapServices) {

            $scope.tripsummary = {};
            $rootScope.isAdsShow = false;
            $scope.bool = {};
            $scope.cntrlName = "Arrived";
            $scope.address_type = "dropoff";
            $scope.bool.isArrived = false;

            $rootScope.preState = $state.current.name;
            localStorage.setItem("lastState", $rootScope.preState);

            //Store auth-token - After login and app kills
            $http.defaults.headers.common['Auth-Token'] = localStorage.getItem('Auth-Token');

            getCustomerRoute();

            $scope.$watchGroup(['cntrlName', 'address_type', 'tripsummary', 'bool'], function() {
                MapServices.cntrlName = $scope.cntrlName;
                MapServices.address_type = $scope.address_type;
                MapServices.tripsummary = $scope.tripsummary;
                MapServices.bool = $scope.bool;
            })


            var map_height = jQuery(window).innerHeight() - (jQuery('.b2').innerHeight() + jQuery('.navbar-header').innerHeight())

            jQuery('#dvMap_arrived').height(map_height);

            function getCustomerRoute() {

                var stored_notification = JSON.parse(localStorage.getItem("notificationInfo"));

                var location = {
                    end_destination: stored_notification ? stored_notification.end_destination : driverLocationConstants.location.end_destination,
                    start_destination: stored_notification ? stored_notification.start_destination : driverLocationConstants.location.start_destination,
                    start_destination_lat: stored_notification ? stored_notification.start_destination_lat : driverLocationConstants.location.start_destination_lat,
                    start_destination_lng: stored_notification ? stored_notification.start_destination_lng : driverLocationConstants.location.start_destination_lng,
                    end_destination_lat: stored_notification ? stored_notification.end_destination_lat : driverLocationConstants.location.end_destination_lat,
                    end_destination_lng: stored_notification ? stored_notification.end_destination_lng : driverLocationConstants.location.end_destination_lng,

                    id: stored_notification ? stored_notification.id : driverLocationConstants.location.id,

                    source_place_id: stored_notification ? stored_notification.source_place_id : driverLocationConstants.location.source_place_id,
                    destination_place_id: stored_notification ? stored_notification.destination_place_id : driverLocationConstants.location.destination_place_id,
                }

                driverLocationConstants.location = location;

                $scope.tripsummary = {

                    pickupAt: driverLocationConstants.location.start_destination,
                    pickupAtLat: driverLocationConstants.location.start_destination_lat,
                    pickupAtLng: driverLocationConstants.location.start_destination_lng,

                    dropoffAt: driverLocationConstants.location.end_destination,
                    dropoffAtLat: driverLocationConstants.location.end_destination_lat,
                    dropoffAtLng: driverLocationConstants.location.end_destination_lng,

                    trip_id: driverLocationConstants.location.id,

                    source_place_id: driverLocationConstants.location.source_place_id,
                    destination_place_id: driverLocationConstants.location.destination_place_id
                };

                MapServices.init('dvMap_arrived');
            }

            $scope.passenger_arrived = function() {
                $scope.trip = {
                    id: $scope.tripsummary.trip_id
                }

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

        }
    ])