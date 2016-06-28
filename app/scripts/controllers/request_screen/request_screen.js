'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:requestScreenCtrl
 * @description
 * # requestScreenCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('requestScreenCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider',
        function($scope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider) {
            // get Customer route directions
            $scope.tripsummary = {};
            getCustomerRoute();
            dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify,false);

            function getCustomerRoute() {
                $scope.tripsummary.pickupAt = 'Marathahalli, Bengaluru, Karnataka 560037, India';
                $scope.tripsummary.dropoffAt = 'Hebbal, Bengaluru, Karnataka 560024, India';
            }

            function trip_accept() {
            }

            function trip_deny() {
            }

            // google map integartion
            document.addEventListener("deviceready", onDeviceReady, false);

            function onDeviceReady() {
                //navigator.geolocation.watchPosition(onSuccess, onError);
                alert('onDeviceReady');
                navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });

                function onSuccess(position) {
                    alert('Latitude: ' + position.coords.latitude + '\n' +
                        'Longitude: ' + position.coords.longitude + '\n' +
                        'Altitude: ' + position.coords.altitude + '\n' +
                        'Accuracy: ' + position.coords.accuracy + '\n' +
                        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                        'Heading: ' + position.coords.heading + '\n' +
                        'Speed: ' + position.coords.speed + '\n' +
                        'Timestamp: ' + position.timestamp + '\n');

                    var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var mapOptions = {
                        center: LatLng,
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
                    alert('mapp', map);
                    var marker = new google.maps.Marker({
                        position: LatLng,
                        map: map,
                        title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude
                    });
                    google.maps.event.addListener(marker, "click", function(e) {
                        var infoWindow = new google.maps.InfoWindow();
                        infoWindow.setContent(marker.title);
                        infoWindow.open(map, marker);
                    });
                };

                function onError(error) {
                    alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
                }
            }
            var progressBarWidth = jQuery(window).innerWidth();
            //var mapHeight = windowHeight - ($(".navbar-header").height() + $(".footer-text").height());
            $('#progressBar').width(progressBarWidth + 'px');

            var progressBar = $('#progress-bar'),width = 0;
            progressBar.width(width);
            var interval = setInterval(function() {
                width += 15;
                progressBar.css('width', width + '%');
                if (width >= 105) {
                    clearInterval(interval);
                    $state.go('core.home')
                }
                $('#js-Visit-count').html(width / 15);
            }, 1000)
        }
    ])
