'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:passengerArrivedCtrl
 * @description
 * # passengerArrivedCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('passengerArrivedCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider','Faye','$location','driverLocationConstants',
        function($scope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider,Faye,$location,driverLocationConstants) {
            
            $scope.tripsummary = {};
            getCustomerRoute();
            dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'dropoffpoint','dvMap_arrived');

            var map_height = jQuery(window).innerHeight() - (jQuery('.b2').innerHeight() + jQuery('.navbar-header').innerHeight())
            //alert('arrived height',map_height);
            jQuery('#dvMap_arrived').height(map_height);
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
            

            $scope.passenger_arrived = function(){
                //$state.go('core.passenger_arrived');
                $scope.trip = {
                   id : $scope.tripsummary.trip_id
                }
                var url = appSettings.serverPath + appSettings.serviceApis.passengerArrived;
                services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.home');
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
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
              
                navigator.geolocation.watchPosition(onSuccess,onError,{timeout: 30000});
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
