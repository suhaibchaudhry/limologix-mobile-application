'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('homeCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window', 'services', 'AppConstants', '$timeout','Faye',
            function($scope, $state, $http, appSettings, notify, $window, services, constants, $timeout,Faye) {
                // /Faye.publish('/publish/784272c40c04371ca495c75a315f83fb', { latitude: '-71.05888010000001', longitude: '-71.05888010000001' });
                Faye.publish("/publish/6224796166ea2e3b5041cfa887915c3b",{ latitude: '-81.05888010000001', longitude: '-81.05888010000001' })
                $scope.driver_name = constants.driver.full_name;
                var windowHeight = jQuery(window).innerHeight();
                var mapHeight = windowHeight - ($(".navbar-header").height() + $(".footer-text").height());
                $('#dvMap').height(mapHeight + 'px');
                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //if (navigator.geolocation) {
                var onSuccess = function(position) {
                        // alert('Latitude: ' + position.coords.latitude + '\n' +
                        //     'Longitude: ' + position.coords.longitude + '\n' +
                        //     'Altitude: ' + position.coords.altitude + '\n' +
                        //     'Accuracy: ' + position.coords.accuracy + '\n' +
                        //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                        //     'Heading: ' + position.coords.heading + '\n' +
                        //     'Speed: ' + position.coords.speed + '\n' +
                        //     'Timestamp: ' + position.timestamp + '\n');
                };

                // onError Callback receives a PositionError object
                //
                function onError(error) {
                    alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
                }

                navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
                if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(p) {
                            var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                            var mapOptions = {
                                center: LatLng,
                                zoom: 13,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };
                            var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
                            var marker = new google.maps.Marker({
                                position: LatLng,
                                map: map,
                                icon: 'images/driver/gps-icon.png',
                                title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
                            });
                            google.maps.event.addListener(marker, "click", function(e) {
                                var infoWindow = new google.maps.InfoWindow();
                                infoWindow.setContent(marker.title);
                                infoWindow.open(map, marker);
                            });
                        });
                } else {
                    alert('Geo Location feature is not supported in this browser.');
                }
            }
]);
