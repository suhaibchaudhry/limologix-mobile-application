'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the LimoCordova
 */
app    
    .controller('homeCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window', 'services', 'AppConstants', '$timeout','$location','FayeTest','driverLocationConstants',
            function($scope, $state, $http, appSettings, notify, $window, services, constants, $timeout,$location,FayeTest,driverLocationConstants) {
                             
                
                $scope.driver_name = constants.driver.full_name ? constants.driver.full_name : 'shyam';
                var windowHeight = jQuery(window).innerHeight();
                var mapHeight = windowHeight - ($(".navbar-header").height() + $(".footer-text").height());
                $('#dvMap').height(mapHeight + 'px');
                

                FCMPlugin.getToken(
                  function(token){
                    //alert(token);
                  },
                  function(err){
                    //alert('error retrieving token: ' + err);
                  }
            )
            FCMPlugin.onNotification(   
                function(data){
                    alert('dsd')
                     if(data.wasTapped){
                     //Notification was received on device tray and tapped by the user.
                        //alert(data);
                         alert(JSON.stringify(data));

                        var title = data.aps.alert.title;
                        var body = data.aps.alert.body;
                        var notification_alert = '<div class="alert alert-info"><strong>'+title+'</strong>'+" : "+body+'</div>';
                        jQuery('#dvMap').append(notification_alert);
                       // $state.go('core.request_screen')

                        setTimeout(function(){
                            $state.go('core.request_screen')
                        },5000);

                     }else{
                     //Notification was received in foreground. Maybe the user needs to be notified.
                        alert(JSON.stringify(data));
                        var title = data.aps.alert.title;
                        var body = data.aps.alert.body;

                        var notification_alert = '<div class="alert alert-info"><strong>'+title+'</strong>'+body+'</div>'
                        jQuery('#dvMap').append(notification_alert);

                       // $state.go('core.request_screen')

                       var location = JSON.stringify(JSON.parse(data.trip));
                       var end_destination = JSON.parse(location).end_destination.place; 
                       var start_destination = JSON.parse(location).start_destination.place; 
                       var id = JSON.parse(location).id; 
                       driverLocationConstants.location = {
                          end_destination : end_destination,
                          start_destination : start_destination,
                          id : id
                       }

                        setTimeout(function(){
                            $state.go('core.request_screen')
                        },5000);
                       
                     }
                 },
                 function(msg){
                   //alert('onNotification callback successfully registered  ohhhhh: ' + msg);
                 },
                 function(err){
                   //alert('Error registering onNotification callback: ' + err);
                 }
            );
            FCMPlugin.subscribeToTopic('topicExample');
   
                

                              
                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //if (navigator.geolocation) {
                var onSuccess = function(position) {
                    var url = appSettings.serverPath + appSettings.serviceApis.getChannelName;
                    services.funcGetRequest(url).then(function(response,status) {
                     $scope.channelName = response.data.channel;
                     //Faye.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });
                     faye($scope,$window,position);
                    },function(error){
                          notify({ classes: 'alert-danger', message: response.message });
                    });
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
                    //alert('code: ' + error.code + '\n' +
                       // 'message: ' + error.message + '\n');
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

               navigator.geolocation.watchPosition(onSuccess,onError,{timeout: 30000})
               
            }
])
.factory('FayeTest',function($window) {
        //return $faye("http://172.16.90.117:9292/faye");
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
            
       var FayeServerURL = 'http://172.16.90.117:9292/faye';
        var client = new Faye.Client(FayeServerURL);
        client.addExtension(Logger);
          return {
            publish: function(channel, message) {
              client.publish(channel, message);
            },

            subscribe: function(channel, callback) {
              client.subscribe(channel, callback);
            }
          }
    })


function faye($scope,$window,position){
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
   var client = new Faye.Client('http://172.16.90.117:9292/faye');  
    client.addExtension(Logger);
    var publication = client.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });
    publication.callback(function() {
        //alert('Connection established successfully.');
    });
    publication.errback(function(error) {
        //alert('There was a problem: ' + error.message);
    });
}
