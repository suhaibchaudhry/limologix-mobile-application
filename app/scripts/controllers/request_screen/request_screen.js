'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:requestScreenCtrl
 * @description
 * # requestScreenCtrl
 * Controller of the LimoCordova
 */
app
    .controller('requestScreenCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider','driverLocationConstants','FayeTest','$location',
        function($scope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider,driverLocationConstants,FayeTest,$location) {
            // get Customer route directions
            $scope.tripsummary = {};
            getCustomerRoute();
            dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify,false);

            function getCustomerRoute() {
                $scope.tripsummary = {
                    pickupAt : driverLocationConstants.location.start_destination,
                    dropoffAt : driverLocationConstants.location.end_destination,
                    trip_id: driverLocationConstants.location.id
                };
               // $scope.tripsummary.pickupAt = driverLocationConstants.location.start_destination;//'Marathahalli, Bengaluru, Karnataka 560037, India';
                //$scope.tripsummary.dropoffAt = driverLocationConstants.location.end_destination;//'Hebbal, Bengaluru, Karnataka 560024, India';
                
            }

            var progressBarWidth = jQuery(window).innerWidth();
            //var mapHeight = windowHeight - ($(".navbar-header").height() + $(".footer-text").height());
            $('#progressBar').width(progressBarWidth + 'px');

            var progressBar = $('#progress-bar'),width = 0;
            progressBar.width(width);
            $scope.interval = setInterval(function() {
                width += 15;
                progressBar.css('width', width + '%');
                if (width >= 105) {
                    clearInterval($scope.interval);
                    $state.go('core.home')
                }
                $('#js-Visit-count').html(width / 15);
            }, 1000)



            $scope.trip_accept = function() {
                clearInterval($scope.interval);
                $scope.trip = {
                    id : $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.tripAccept;
                    services.funcPostRequest(url,{"trip": $scope.trip}).then(function(response,status) {
                    clearInterval($scope.interval);
                    $state.go('core.passenger_boarded');

                },function(error){
                      notify({ classes: 'alert-danger', message: error.message });
                      $state.go('core.passenger_boarded');
                });
            }

            $scope.trip_deny = function() {
                clearInterval($scope.interval);
                $scope.trip = {
                   id : $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.tripDeny;
                    services.funcPostRequest(url,{"trip": $scope.trip}).then(function(response,status) {
                    clearInterval($scope.interval);
                    $state.go('core.home');
                },function(error){
                      notify({ classes: 'alert-danger', message: error.message });
                       $state.go('core.home');
                });
            }
                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //if (navigator.geolocation) {
                var onSuccess = function(position) {
                    var url = appSettings.serverPath + appSettings.serviceApis.getChannelName;
                    services.funcGetRequest(url).then(function(response,status) {
                     $scope.channelName = response.data.channel;
                     faye($scope,$window,position,appSettings);
                    },function(error){
                         notify({ classes: 'alert-danger', message: response.message });
                    });
                };

                // onError Callback receives a PositionError object
                function onError(error) {
                    //alert('code: ' + error.code + '\n' +
                    // 'message: ' + error.message + '\n');
                }
              
                navigator.geolocation.watchPosition(onSuccess,onError,{timeout: 30000})
        }
    ])
.factory('FayeTest',function($window) {
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
            
       var FayeServerURL = 'http://159.203.81.112:9292/faye';//'http://172.16.90.117:9292/faye';
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


function faye($scope,$window,position,appSettings){
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
   var client = new Faye.Client('http://159.203.81.112:9292/faye');  
    client.addExtension(Logger);
    var publication = client.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });
    publication.callback(function() {
        //alert('Connection established successfully.');
    });
    publication.errback(function(error) {
        //alert('There was a problem: ' + error.message);
    });
}
