'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:requestScreenCtrl
 * @description
 * # requestScreenCtrl
 * Controller of the LimoCordova
 */
app
    .controller('requestScreenCtrl', ['$scope', '$rootScope','$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider','driverLocationConstants','Faye','$location',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider,driverLocationConstants,Faye,$location) {
            // get Customer route directions
            $scope.tripsummary = {};
            $rootScope.isAdsShow = false;
            $scope.isAccepted = false;
            getCustomerRoute();
            dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify, false, '', 'dvMap_requestscreen');

            function getCustomerRoute() {
                $scope.tripsummary = {
                    pickupAt : driverLocationConstants.location.start_destination,
                    dropoffAt : driverLocationConstants.location.end_destination,
                    trip_id: driverLocationConstants.location.id
                };
               // $scope.tripsummary.pickupAt = driverLocationConstants.location.start_destination;//'Marathahalli, Bengaluru, Karnataka 560037, India';
                //$scope.tripsummary.dropoffAt = driverLocationConstants.location.end_destination;//'Hebbal, Bengaluru, Karnataka 560024, India';
                
            }

            function started(duration) {
                var TotalSeconds = 14;
                var documentWidth = $(document).width();
                var start = Date.now();
                $scope.intervalSetted = null;

                function timer() {
                    var diff = duration - (((Date.now() - start) / 1000) | 0);
                    var seconds = (diff % 60) | 0;
                    seconds = seconds < 10 ? "0" + seconds : seconds;
                    $('#timer').html(seconds);
                    var progresBarWidth = (seconds * documentWidth / TotalSeconds);

                    $('#progress').css({
                        width: progresBarWidth + 'px'
                    });

                    if (diff <= 0) {
                        clearInterval($scope.intervalSetted);
                        $state.go('core.home')
                    }
                }

                timer();
                $scope.intervalSetted = setInterval(timer, 1000);
            }

            started(14);





            var progressBarWidth = jQuery(window).innerWidth();
            $('#progressBar').width(progressBarWidth + 'px');

            var progressBar = $('#progress-bar'),width = 0;
            progressBar.width(width);
            $scope.interval = setInterval(function() {
                width += 7.25;//15;
                progressBar.css('width', width + '%');
                //if (width >= 105) {
                if (width >= 101.25) {
                    clearInterval($scope.interval);
                    $state.go('core.home')
                }
                $('#js-Visit-count').html(width / 7.25);//15);
            }, 1000)


            $scope.trip_accept = function() {
                clearInterval($scope.interval);
                clearInterval($scope.intervalSetted);
                $scope.trip = {
                    id : $scope.tripsummary.trip_id
                }

                $scope.isAccepted = true;
                var url = appSettings.serverPath + appSettings.serviceApis.tripAccept;
                    services.funcPostRequest(url,{"trip": $scope.trip}).then(function(response,status) {
                    clearInterval($scope.interval);
                    $state.go('core.passenger_boarded');

                },function(error){
                      notify({ classes: 'alert-danger', message: error.message });
                      $state.go('core.home');
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
                     faye(Faye,$scope,$window,position);
                    },function(error){
                         notify({ classes: 'alert-danger', message: response.message });
                    });
                };

                // onError Callback receives a PositionError object
                function onError(error) {
                    //alert('code: ' + error.code + '\n' +
                    // 'message: ' + error.message + '\n');
                }
              
                navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

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

