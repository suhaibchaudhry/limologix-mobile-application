'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the LimoCordova
 */
app    
    .controller('homeCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window', 'services', 'AppConstants', '$timeout',
            function($scope, $state, $http, appSettings, notify, $window, services, constants, $timeout) {
                             
                // /Faye.publish('/publish/784272c40c04371ca495c75a315f83fb', { latitude: '-71.05888010000001', longitude: '-71.05888010000001' });
                
                $scope.driver_name = constants.driver.full_name ? constants.driver.full_name : 'shyam';
                var windowHeight = jQuery(window).innerHeight();
                var mapHeight = windowHeight - ($(".navbar-header").height() + $(".footer-text").height());
                $('#dvMap').height(mapHeight + 'px');
                
                

                              
                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //if (navigator.geolocation) {
                var onSuccess = function(position) {
                    var url = appSettings.serverPath + appSettings.serviceApis.getChannelName;
                    services.funcGetRequest(url).then(function(response,status) {
                     $scope.channelName = response.data.channel;
                     //alert(Faye)
                     //Faye.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });
                     //faye($scope,$window,position);
                    },function(error){
                          notify({ classes: 'alert-danger', message: response.message });
                    });
                    //faye($scope,$window);
                    // var token = $window.sessionStorage['Auth-Token'];
                    //Faye.publish("/publish/"+token,{ latitude: position.coords.latitude, longitude: position.coords.longitude })
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
                                icon: 'images/driver/gps-icon.3919872e.png',
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

               // navigator.geolocation.watchPosition(onSuccess,onError,{timeout: 30000})
               
            }
])


// function faye($scope,$window,position){
//     //  var Logger = {
//     //             incoming: function(message, callback) {
//     //                 console.log('incomin    g', message);
//     //                 callback(message);
//     //             },   
//     //             outgoing: function(message, callback) {
//     //                 message.ext = message.ext || {};
//     //                 message.ext.auth_token = $window.sessionStorage['Auth-Token'];
//     //                 message.ext.user_type = "driver";
//     //                 console.log('outgoing', message);
//     //                 callback(message);
//     //             }
//     // };
//    // var client = new Faye.Client('http://172.16.90.117:9292/faye');  
//     //client.addExtension(Logger);
//     var publication = client.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });
//     publication.callback(function() {
//         alert('Connection established successfully.');
//     });
//     publication.errback(function(error) {
//         alert('There was a problem: ' + error.message);
//     });
// }
