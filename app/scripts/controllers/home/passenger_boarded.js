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
        'services', 'AppConstants', 'dispatchRideProvider','driverLocationConstants',
        function($scope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider,driverLocationConstants) {
            $scope.tripsummary = {};
            getCustomerRoute();
            dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'pickuppoint');
            function getCustomerRoute() {
               $scope.tripsummary.pickupAt = driverLocationConstants.location.start_destination;//'Marathahalli, Bengaluru, Karnataka 560037, India';
               $scope.tripsummary.dropoffAt = driverLocationConstants.location.end_destination;//'Hebbal, Bengaluru, Karnataka 560024, India';
                // var url = appSettings.serverPath + appSettings.serviceApis.signin;
                // services.funcPostRequest(url, $scope.driverDetails).then(function(response) {
                //     console.log($scope.driverDetails);
                //     console.log(response);
                //     localStorage.setItem("drivername", response.data.full_name)
                //     notify({ classes: 'alert-success', message: response.message });
                //     $state.go('app.dashboard');
                // }, function(error) {
                //     notify({ classes: 'alert-danger', message: error });
                // });
            }

            if (navigator.geolocation) {
                // navigator.geolocation.getCurrentPosition(geolocationSuccess, [geolocationError], [geolocationOptions]);
                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //
                var onSuccess = function(position) {
//                     alert('Latitude: ' + position.coords.latitude + '\n' +
//                         'Longitude: ' + position.coords.longitude + '\n' +
//                         'Altitude: ' + position.coords.altitude + '\n' +
//                         'Accuracy: ' + position.coords.accuracy + '\n' +
//                         'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
//                         'Heading: ' + position.coords.heading + '\n' +
//                         'Speed: ' + position.coords.speed + '\n' +
//                         'Timestamp: ' + position.timestamp + '\n');
                };

                // onError Callback receives a PositionError object
                //
                function onError(error) {
                    alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
                }

                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }

           

            // if (navigator.geolocation) {
            //     navigator.geolocation.getCurrentPosition(function(p) {
            //         var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
            //         var mapOptions = {
            //             center: LatLng,
            //             zoom: 13,
            //             mapTypeId: google.maps.MapTypeId.ROADMAP
            //         };
            //         var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
            //         var marker = new google.maps.Marker({
            //             position: LatLng,
            //             map: map,
            //             title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
            //         });
            //         google.maps.event.addListener(marker, "click", function(e) {
            //             var infoWindow = new google.maps.InfoWindow();
            //             infoWindow.setContent(marker.title);
            //             infoWindow.open(map, marker);
            //         });
            //     });
            // } else {
            //     alert('Geo Location feature is not supported in this browser.');
            // }

        }
    ])
