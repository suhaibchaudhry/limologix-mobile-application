'use strict';

/**
 * @ngdoc function
 * @name Limo Logix.controller:requestScreenCtrl
 * @description
 * # requestScreenCtrl
 * Controller of the Limo Logix
 */
app
    .controller('requestScreenCtrl', ['$scope', '$rootScope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'driverLocationConstants', 'Faye', '$location', 'MapServices',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, driverLocationConstants, Faye, $location, MapServices) {
            setTimeout(function() {
                var fixedDivs = jQuery('header').innerHeight() + jQuery('footer').innerHeight() + jQuery('.fixed-head').innerHeight() + jQuery('.fixed-footer').innerHeight();
                var mapHeight = jQuery(window).innerHeight() - fixedDivs - 100 -15;
                jQuery(".dvMap_circle").height(mapHeight);
                jQuery(".dvMap_circle").width(mapHeight);
            }, 1000);

            // get Customer route directions
            $scope.tripsummary = {};
            $rootScope.isAdsShow = false;
            $scope.isAccepted = false;
            $scope.cntrlName = 'notification';
            $scope.address_type = "notification";
            //MapServices.cntrlScope = $scope;
            getCustomerRoute();

            $scope.$watchGroup(['cntrlName', 'tripsummary', 'address_type'], function() {
                MapServices.cntrlName = $scope.cntrlName;
                MapServices.tripsummary = $scope.tripsummary;
                MapServices.address_type = $scope.address_type;
            })

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
                MapServices.init('dvMap_requestscreen');
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
        }
    ])
