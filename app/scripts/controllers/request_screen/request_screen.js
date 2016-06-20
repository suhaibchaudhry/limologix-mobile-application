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
        'services', 'AppConstants',
        function($scope, $state, $http, appSettings, notify, $window, services, constants) {
            if (navigator.geolocation) {
                // navigator.geolocation.getCurrentPosition(geolocationSuccess, [geolocationError], [geolocationOptions]);
                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //
                var onSuccess = function(position) {
                    alert('Latitude: ' + position.coords.latitude + '\n' +
                        'Longitude: ' + position.coords.longitude + '\n' +
                        'Altitude: ' + position.coords.altitude + '\n' +
                        'Accuracy: ' + position.coords.accuracy + '\n' +
                        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                        'Heading: ' + position.coords.heading + '\n' +
                        'Speed: ' + position.coords.speed + '\n' +
                        'Timestamp: ' + position.timestamp + '\n');
                };

                // onError Callback receives a PositionError object
                //
                function onError(error) {
                    alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
                }

                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }


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

            function progress(percent, $element) {
                var progressBarWidth = percent * $element.width() / 100;
                $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "% ");
            }
            var count = 1;
            setInterval(function(){
                 count++;
                progress(parseInt(count+"0"), $('#progressBar'));
                if(count == 10){
                    $state.go('core.home'); 
                    return;  
                }
            },1000);


            //timeout,1000);
            function timeout(){

               
            }
            

        }
    ])
