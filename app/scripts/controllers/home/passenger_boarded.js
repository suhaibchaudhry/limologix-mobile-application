'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:passengerBoardedCtrl
 * @description
 * # passengerBoardedCtrl
 * Controller of the LimoCordova
 */
app
    .controller('passengerBoardedCtrl', ['$scope', '$rootScope','$state', '$http', 'appSettings', 'notify', '$window',
        'services', 'AppConstants', 'dispatchRideProvider','driverLocationConstants','Faye','$location',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, dispatchRideProvider,driverLocationConstants,Faye,$location) {
                        
            $scope.tripsummary = {};
            $rootScope.isAdsShow = false;
            $scope.bool={};
            $scope.bool.isBoardedBtnVisible = false;
            getCustomerRoute();

            //dispatchRideProvider.getRoutes($scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'pickuppoint','dvMap_boarded');
            
            var map_height = jQuery(window).innerHeight() - (jQuery('.b1').innerHeight() + jQuery('.navbar-header').innerHeight())
            jQuery('#dvMap_boarded').height(map_height);
            
           
            function getCustomerRoute() {
               $scope.tripsummary = {
                    pickupAt : driverLocationConstants.location.start_destination,
                    pickupAtLat : driverLocationConstants.location.start_destination_lat,
                    pickupAtLng: driverLocationConstants.location.start_destination_lng,

                    dropoffAt : driverLocationConstants.location.end_destination,
                    dropoffAtLat: driverLocationConstants.location.end_destination_lat,
                    dropoffAtLng: driverLocationConstants.location.end_destination_lng,

                    trip_id: driverLocationConstants.location.id
                };                
                
            }

            MapServices.init('dvMap_boarded');
            MapServices.getCurrentPositions().then(function(){
                MapServices.addDirectionRoutes('pickup','',$scope.tripsummary.pickupAt,$scope.tripsummary.dropoffAt);
                Mapservice.getPickupLatLng($scope.tripsummary.pickupAtLat,$scope.tripsummary.pickupAtLng,$scope);
                MapServices.watchPositions();
            },function(error){
                console.log(error);
            });
            
           



            ////////////old code befor refactoring ///////////////

           //  var options = {
           //    maximumAge: 3600000,
           //    timeout: 3000,
           //    enableHighAccuracy: true,
           // }
           //  //GET CURRENT LOCATION ON PAGE LOAD
           //  navigator.geolocation.getCurrentPosition(getCurrentPosition,onError,options)

           //  function getCurrentPosition(position) {               
           //      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           //      var geocoder = new google.maps.Geocoder();
           //      if (geocoder) {
           //          geocoder.geocode({
           //              'latLng': latlng
           //          }, function(results, status) {
           //              if (status == google.maps.GeocoderStatus.OK) {
           //                  console.log("driver place= ", results[0].formatted_address);
           //                  $scope.currentLocation = results[0].formatted_address;
           //                  dispatchRideProvider.getRoutes($scope.currentLocation,$scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt,notify,true,'pickuppoint','dvMap_boarded');
           //                  // dispatchRideProvider.getRoutes($scope.currentLocation, $scope.tripsummary.pickupAt, $scope.tripsummary.dropoffAt, notify, true, 'pickuppoint');
           //              }
           //          });
           //      }

           //  }
           //  var options = {
           //      maximumAge: 3000000,
           //      timeout: 3000,
           //      enableHighAccuracy: true,
           //   }
             // watch driver location                   
              // $scope.googleposition_id = navigator.geolocation.watchPosition(onSuccess,onError,options)                 


              //   // onSuccess Callback
              //   // This method accepts a Position object, which contains the
              //   // current GPS coordinates
              //   //if (navigator.geolocation) {
              //   function onSuccess(position) {

              //     //update marker position
              //     if(dispatchRideProvider.map && dispatchRideProvider.marker){
              //        dispatchRideProvider.marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
              //        var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              //        dispatchRideProvider.map.setCenter(center);
              //     }  

              //     faye(Faye,$scope,$rootScope,$window,position); 

              //     console.log("test position", position.coords.latitude,position.coords.longitude);
              //     var p1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);                  
              //     var p2 = new google.maps.LatLng($scope.tripsummary.pickupAtLat, $scope.tripsummary.pickupAtLng);                                  
              //     console.log("p1 and p2",p1,p2,google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
              //     //alert(google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
              //     if (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) < 500) { //within 1km //18.66
              //         swal({
              //               title: 'Boarded!',
              //               text: 'You are close to pickup location',
              //               type: "success"
              //         },function(){                       
              //           navigator.geolocation.clearWatch($scope.googleposition_id);                                   
                        
              //         })
              //         $('#boardedBtn').addClass('buttonBoarded');
              //         $scope.bool.isBoardedBtnVisible = true;
              //         if (!$scope.$$phase) {
              //           $scope.$digest();
              //         };
              //         //$('#boardedBtn').addClass('buttonBoarded');                      
              //     } else{
              //        // alert('out of radius')                    
                      
              //     }                      
              //   }

              //   // onError Callback receives a PositionError object
              //   function onError(error) {
              //       // alert('code: ' + error.code + '\n' +
              //       // 'message: ' + error.message + '\n');
              //   }
                     
                
            // $scope.$watch('bool', function(){
            //   //alert('digest');              
            // }, true)

            $scope.passenger_boarded = function(){
                $scope.trip = {
                   id : $scope.tripsummary.trip_id
                }           

                if($rootScope.online){
                   var url = appSettings.serverPath + appSettings.serviceApis.passengerBoarded;
                    services.funcPostRequest(url, { "trip": $scope.trip }).then(function(response) { 
                        notify.closeAll();                   
                        notify({ classes: 'alert-success', message: response.message });                   
                        $state.go('core.passenger_arrived');
                    }, function(error) {                  
                        notify.closeAll();
                        notify({ classes: 'alert-danger', message: error }); 
                        $state.go('core.home');                   
                    });                             
                    $scope.bool.isBoardedBtnVisible = false;
                    if (!$scope.$$phase) {
                      $scope.$digest();
                    };
                  }else{
                    alert('The internet connection appears to be offline');
                  }
               
            }

            // function faye(Faye,$scope,$rootScope,$window,position) {
            //     var Logger = {
            //         incoming: function(message, callback) {
            //             //console.log('passenger borded incoming', message);
            //             callback(message);
            //         },
            //         outgoing: function(message, callback) {
            //             message.ext = message.ext || {};
            //             message.ext.auth_token = $window.sessionStorage['Auth-Token'];
            //             message.ext.user_type = "driver";
            //             //console.log(' passenger borded outgoing', message);
            //             callback(message);
            //         }
            //     };
            //     var client = Faye.getClient();
            //     client.addExtension(Logger);

                

            //     if($rootScope.channelName){
            //       var publication = client.publish('/publish/'+ $rootScope.channelName, { latitude: position.coords.latitude, longitude: position.coords.longitude });

            //       publication.callback(function() {
            //           //alert('Connection established successfully.');
            //       });
            //       publication.errback(function(error) {
            //           // alert('There was a problem: ' + error.message);
            //       });
            //     }
                
            // }
        }
])
