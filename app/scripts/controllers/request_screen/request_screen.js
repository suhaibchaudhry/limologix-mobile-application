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
        function($scope, $state, $http, appSettings, notify, $window, services, constants,dispatchRideProvider) {
            // get Customer route directions
            $scope.tripsummary = {};
            getCustomerRoute();
            dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify);
            function getCustomerRoute() {
                $scope.tripsummary.pickupAt = 'Marathahalli, Bengaluru, Karnataka 560037, India';
                $scope.tripsummary.dropoffAt = 'Hebbal, Bengaluru, Karnataka 560024, India';
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


             function trip_accept(){
                // var url = appSettings.serverPath + appSettings.serviceApis.tripAccept;
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
            function trip_deny(){
                // var url = appSettings.serverPath + appSettings.serviceApis.tripAccept;
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

            // cordova.ready.then(function(){
            //     alert('cordova is ready');
            // });
//             if (navigator.geolocation) {
//                 function onSuccess(position) {
//                     alert('Latitude: ' + position.coords.latitude + '\n' +
//                         'Longitude: ' + position.coords.longitude + '\n' +
//                         'Altitude: ' + position.coords.altitude + '\n' +
//                         'Accuracy: ' + position.coords.accuracy + '\n' +
//                         'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
//                         'Heading: ' + position.coords.heading + '\n' +
//                         'Speed: ' + position.coords.speed + '\n' +
//                         'Timestamp: ' + position.timestamp + '\n');

//                     var LatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//                     var mapOptions = {
//                         center: LatLng,
//                         zoom: 13,
//                         mapTypeId: google.maps.MapTypeId.ROADMAP
//                     };
//                     var map = new google.maps.Map(document.getElementById("dvMap12"), mapOptions);
//                     alert('mapp', map);
//                     var marker = new google.maps.Marker({
//                         position: LatLng,
//                         map: map,
//                         title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude
//                     });
//                     google.maps.event.addListener(marker, "click", function(e) {
//                         var infoWindow = new google.maps.InfoWindow();
//                         infoWindow.setContent(marker.title);
//                         infoWindow.open(map, marker);
//                     });
//                 };

//                 // onError Callback receives a PositionError object
//                 //
//                 function onError(error) {
//                     alert('code: ' + error.code + '\n' +
//                         'message: ' + error.message + '\n');
//                 }


//                 //                 try {
//                 //                     navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 3600000, enableHighAccuracy: false });

//                 //                 } catch (err) { alert('err'); }


//                 navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 3600000, enableHighAccuracy: true });
//             }


            function progress(percent, $element) {
                var progressBarWidth = percent * $element.width() / 100;
                $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "% ");
            }
            var count = 1;
//             setInterval(function() {
//                 count++;
//                 progress(parseInt(count + "0"), $('#progressBar'));
//                 if (count == 10) {
//                     $state.go('core.home');
//                     return;
//                 }
//             }, 1000);


        }
    ])
