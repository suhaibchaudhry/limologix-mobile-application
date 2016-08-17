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
        'services', 'AppConstants', 'dispatchRideProvider','driverLocationConstants','Faye','$location',
        function($scope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider,driverLocationConstants,Faye,$location) {
                        
            $scope.tripsummary = {};
            getCustomerRoute();
            dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'pickuppoint','dvMap_boarded');
            
            var map_height = jQuery(window).innerHeight() - (jQuery('.b1').innerHeight() + jQuery('.navbar-header').innerHeight())
            alert(map_height)
            jQuery('#dvMap_boarded').height(map_height);
            
            function getCustomerRoute() {
               // $scope.tripsummary.pickupAt = 'Marathahalli, Bengaluru, Karnataka 560037, India';
               // $scope.tripsummary.dropoffAt = 'Hebbal, Bengaluru, Karnataka 560024, India';
               // $scope.tripsummary.trip_id = 3;
            $scope.tripsummary = {
                    pickupAt : driverLocationConstants.location.start_destination,
                    dropoffAt : driverLocationConstants.location.end_destination,
                    trip_id: driverLocationConstants.location.id
                };
            }

            $scope.passenger_boarded = function(){
                //$state.go('core.passenger_arrived');
                $scope.trip = {
                   id : $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.passengerBoarded;
                services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.passenger_arrived');
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                    $state.go('core.passenger_arrived');
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
                function faye(Faye,$scope,$window,position) {
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
                    var client = Faye.getClient();
                    client.addExtension(Logger);
                    var publication = client.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });

                    publication.callback(function() {
                        //alert('Connection established successfully.');
                    });
                    publication.errback(function(error) {
                        // alert('There was a problem: ' + error.message);
                    });
                }
        }
])
  // factory('FayeTest',function($window) {
  //       var Logger = {
  //                   incoming: function(message, callback) {
  //                       console.log('incoming', message);
  //                       callback(message);
  //                   },
  //                   outgoing: function(message, callback) {
  //                       message.ext = message.ext || {};
  //                       message.ext.auth_token = $window.sessionStorage['Auth-Token'];
  //                       message.ext.user_type = "driver";
  //                       console.log('outgoing', message);
  //                       callback(message);
  //                   }
  //       };
            
  //      var FayeServerURL = 'http://159.203.81.112:9292/faye';//'http://172.16.90.117:9292/faye';
  //       var client = new Faye.Client(FayeServerURL);
  //       client.addExtension(Logger);
  //         return {
  //           publish: function(channel, message) {
  //             client.publish(channel, message);
  //           },

  //           subscribe: function(channel, callback) {
  //             client.subscribe(channel, callback);
  //           }
  //         }
  //   })


// function faye($scope,$window,position,appSettings){
//      var Logger = {
//                 incoming: function(message, callback) {
//                     console.log('incoming', message);
//                     callback(message);
//                 },   
//                 outgoing: function(message, callback) {
//                     message.ext = message.ext || {};
//                     message.ext.auth_token = $window.sessionStorage['Auth-Token'];
//                     message.ext.user_type = "driver";
//                     console.log('outgoing', message);
//                     callback(message);
//                 }
//     };
//    var client = new Faye.Client('http://159.203.81.112:9292/faye');  
//     client.addExtension(Logger);
//     var publication = client.publish('/publish/'+ $scope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });
//     publication.callback(function() {
//         //alert('Connection established successfully.');
//     });
//     publication.errback(function(error) {
//         //alert('There was a problem: ' + error.message);
//     });
// }
