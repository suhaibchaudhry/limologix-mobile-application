'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:passengerBoardedCtrl
 * @description
 * # passengerBoardedCtrl
 * Controller of the LimoCordova
 */
app
    .controller('passengerBoardedCtrl', ['$scope', '$rootScope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants','driverLocationConstants', 'Faye', '$location', 'MapServices',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, driverLocationConstants, Faye, $location, MapServices) {

            $scope.tripsummary = {};
            $rootScope.isAdsShow = false;
            $scope.bool = {};
            $scope.cntrlName = "Boarded";
            $scope.address_type = "pickup";
            $scope.bool.isBoardedBtnVisible = false;

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

            var map_height = jQuery(window).innerHeight() - (jQuery('.b1').innerHeight() + jQuery('.navbar-header').innerHeight())
            jQuery('#dvMap_boarded').height(map_height);


            function getCustomerRoute() {
                var stored_notification = JSON.parse(localStorage.getItem("notificationInfo"));
                console.log('driverLocationConstants', driverLocationConstants);

                var location = {
                    end_destination: stored_notification ? stored_notification.end_destination : driverLocationConstants.location.end_destination,
                    start_destination: stored_notification ? stored_notification.start_destination : driverLocationConstants.location.start_destination,
                    start_destination_lat: stored_notification ? stored_notification.start_destination_lat : driverLocationConstants.location.start_destination_lat,
                    start_destination_lng: stored_notification ? stored_notification.start_destination_lng : driverLocationConstants.location.start_destination_lng,
                    end_destination_lat: stored_notification ? stored_notification.end_destination_lat : driverLocationConstants.location.end_destination_lat,
                    end_destination_lng: stored_notification ? stored_notification.end_destination_lng : driverLocationConstants.location.end_destination_lng,
                    id: stored_notification ? stored_notification.id : driverLocationConstants.location.id,
                    source_place_id: stored_notification ? stored_notification.source_place_id :  driverLocationConstants.location.source_place_id,
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

                MapServices.init('dvMap_boarded');
                passenger_boarded_trip_details();
            }

            function passenger_boarded_trip_details() {
                $scope.trip = {
                    id: $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.tripSummary;
                services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response) {
                    $scope.tripinfo = response.data.trip;
                    notify.closeAll();
                    //notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify.closeAll();
                    notify({ classes: 'alert-danger', message: error });
                    //$state.go('core.home');
                });
            }
            
            $scope.passenger_boarded = function() {

                $scope.trip = {
                    id: $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.passengerBoarded;
                services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response) {
                    notify.closeAll();
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.passenger_arrived');
                }, function(error) {
                    notify.closeAll();
                    notify({ classes: 'alert-danger', message: error });
                    $state.go('core.home');
                });
                $scope.bool.isBoardedBtnVisible = false;
                if (!$scope.$$phase) {
                    $scope.$digest();
                };
            }
        }
    ])