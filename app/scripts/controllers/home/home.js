'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the LimoCordova
 */
app    
    .controller('homeCtrl', ['$scope', '$rootScope','$state', '$http', 'appSettings', 'notify', '$window', 'services', 'AppConstants', '$timeout','$location','Faye','driverLocationConstants',
            function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, $timeout,$location,Faye,driverLocationConstants) {
                   
                $scope.driver_name = constants.driver.full_name;
                $scope.company_name = constants.driver.company;
                $scope.showAds = false;
                var windowHeight = jQuery(window).innerHeight();
                var mapHeight = windowHeight - ($(".navbar-header").height() + $(".footer-text").height());
                $('#dvMap').height(mapHeight + 'px');


                var galleryBottomPos =$('#dvMap').position().top + $(".footer-text").height();
             $("#slide_cont").css({'bottom':(galleryBottomPos-20)+'px'})
             var galleryImgLeftPos = ($(window).innerWidth() - $('#slideshow_image').innerWidth())/2;
               $("#slideshow_image").css({'left':galleryImgLeftPos+'px'})

               $('body').removeClass('menu-slider');$('body').removeClass('in');

               // Toggle classes in body for syncing sliding animation with other elements
                $('#bs-example-navbar-collapse-2')
                    .on('show.bs.collapse', function(e){
                        $('body').addClass('menu-slider');
                    })
                    .on('shown.bs.collapse', function(e){
                        $('body').addClass('in');
                    })
                    .on('hide.bs.collapse', function(e){
                        $('body').removeClass('menu-slider');
                    })
                    .on('hidden.bs.collapse', function(e){
                        $('body').removeClass('in');
                    });
                
                if($rootScope.isAdsShow){
                  displayAds();                  
                }else{                  
                  $rootScope.FreeAds = setInterval(function(){
                      displayAds();                      
                   },1800000) 
                }                 
              
                
                function displayAds() {
                  var imagesArr = [];
                    var url = appSettings.serverPath + appSettings.serviceApis.displayAdvertisements;
                    services.funcPostRequest(url, { "page": 0, "per_page": 0 }).then(function(response) {
                      
                      if(response.data){
                        //$scope.showAds = true;
                       
                        $scope.adsJSON = response.data.advertisements;
                        for (var i = 0; i < Object.keys($scope.adsJSON).length; i++) {
                            var imgs = $scope.adsJSON[i].poster.image;
                            imagesArr.push(imgs);
                            $scope.imgsArr[i] = imagesArr[i];
                             $("#slide_cont").show();
                        }
                        $scope.imagePath = appSettings.server_images_path;
                        $scope.images = $scope.imgsArr;
                      }else{
                        $("#slide_cont").hide();
                        //$scope.showAds = false;
                      }
                      
                      //notify({ classes: 'alert-success', message: response.message });
                  }, function(error) {
                      notify({ classes: 'alert-danger', message: error });
                  });
              }


                $scope.imgsArr = [];
                $("#prev_image").click(function() {
                    prev();
                });
                $("#next_image").click(function() {
                    next();
                });

                

                function prev() {
                    $('#slideshow_image').fadeOut(300, function() {
                        var prev_val = document.getElementById("img_no").value;
                        var prev_val = Number(prev_val) - 1;
                        if (prev_val <= -1) {
                            prev_val = $scope.images.length - 1;
                        }
                        $('#slideshow_image').attr('src', $scope.imagePath + $scope.images[prev_val]);
                        document.getElementById("img_no").value = prev_val;
                    });
                    $('#slideshow_image').fadeIn(1000);
                }

                function next() {
                    $('#slideshow_image').fadeOut(300, function() {
                        var next_val = document.getElementById("img_no").value;
                        var next_val = Number(next_val) + 1;
                        if (next_val >= $scope.images.length) {
                            next_val = 0;
                        }
                        $('#slideshow_image').attr('src', $scope.imagePath + $scope.images[next_val]);
                        document.getElementById("img_no").value = next_val;
                    });
                    $('#slideshow_image').fadeIn(1000);
                }

                  

                $scope.funcCloseAds = function() {
                  $("#slide_cont").hide();
                }

                //Push notifications from FCM 
           
                FCMPlugin.getToken(
                  function(token){
                   // alert(token);
                  },
                  function(err){
                    //alert('error retrieving token: ' + err);
                  }
                )
                //Receive notification from FCM
                FCMPlugin.onNotification(   
                    function(data){                      
                         if(data.wasTapped){
                         //Notification was received on device tray and tapped by the user.
                            if(data.aps){
                                 var title = data.aps.alert.title;
                                 var body = data.aps.alert.body;
                             }else{
                                 var title = data.notification.title;
                                 var body = data.notification.body;
                             }
                         
                          // get ride request alert
                           if(data.status === "dispatched"){
                              var end_destination = JSON.parse(data.end_destination).place;
                               var start_destination = JSON.parse(data.start_destination).place
                               var id = data.id; 

                               driverLocationConstants.location = {
                                  end_destination : end_destination,
                                  start_destination : start_destination,
                                  start_destination_lat: JSON.parse(data.start_destination).latitude,
                                  start_destination_lng: JSON.parse(data.start_destination).longitude,
                                  end_destination_lat: JSON.parse(data.end_destination).latitude,
                                  end_destination_lng: JSON.parse(data.end_destination).longitude,

                                  id : id
                               }
                               console.log('home page constants',driverLocationConstants.location);
                               $state.go('core.request_screen')
                              
                           }else if(data.status === "account_approved"){
                                swal({
                                  title: title,
                                  text: body,
                                  type: "success"
                                },
                                function(){
                                 $state.go('core.home')
                                })
                           }else{
                                // Insuffient balance alert
                                swal({
                                      title: title,
                                      text: body,
                                      type: "warning",
                                      confirmButtonColor: "#3232ff",   
                                      confirmButtonText: "Recharge", 
                                      showCancelButton: true, 
                                      closeOnConfirm: false
                                  },
                                  //On click of recharge button
                                      function(){
                                       var url = appSettings.serverPath + appSettings.serviceApis.driver_recharge;
                                        services.funcPostRequest(url).then(function(response) {
                                          $scope.remaining_balance = response.data.toll_credit;
                                          swal("Remaining Balance", "You've " +"$"+ $scope.remaining_balance+ " in your account","success")
                                          $state.go('core.home')
                                        }, function(error) {
                                            notify({ classes: 'alert-danger', message: error });
                                        });
                                      //$state.go('core.home')
                                    })
                          }
                              

                          //  var closeInSeconds = 14,
                          //     displayText = "It will close in #1 seconds. Click OK to accept the trip",
                          //     timer;

                          //     swal({
                          //       title: title + '-' + body,   
                          //       text: displayText.replace(/#1/, closeInSeconds),
                          //       type: "success",  
                          //       timer: closeInSeconds * 1000,   
                          //       showConfirmButton: true 
                          //     },function(){
                          //         $state.go('core.request_screen');
                          //     });                       
                          
                          //  timer = setInterval(function() {
                          //     if(closeInSeconds >= 0)
                          //        closeInSeconds--;

                          //     if (closeInSeconds < 0) {
                          //         clearInterval(timer);
                          //     }
                          //     if(closeInSeconds >= 0){
                          //       $('.sweet-alert > p').text(displayText.replace(/#1/, closeInSeconds));     
                          //     }else{
                          //       $('.sweet-alert').hide();
                          //     } 
                          // }, 1000);


                          // swal({
                          //   title: title,
                          //   text: body,
                          //   type: "success"
                          // },
                          // function(){
                          //  $state.go('core.request_screen')
                          // })
                          
                           driverLocationConstants.location = {
                              end_destination : end_destination,
                              start_destination : start_destination,
                              start_destination_lat: JSON.parse(data.start_destination).latitude,
                              start_destination_lng: JSON.parse(data.start_destination).longitude,
                              end_destination_lat: JSON.parse(data.end_destination).latitude,
                              end_destination_lng: JSON.parse(data.end_destination).longitude,

                              id : id
                           }
                           console.log('home page constants',driverLocationConstants.location);
                            

                         }else{
                         //Notification was received in foreground. Maybe the user needs to be notified.
                             if(data.aps){
                                 var title = data.aps.alert.title;
                                 var body = data.aps.alert.body;
                             }else{
                                 var title = data.notification.title;
                                 var body = data.notification.body;
                             }
                           // get ride request alert
                           if(data.status === "dispatched"){
                              var end_destination = JSON.parse(data.end_destination).place;
                               var start_destination = JSON.parse(data.start_destination).place
                               var id = data.id; 

                               driverLocationConstants.location = {
                                  end_destination : end_destination,
                                  start_destination : start_destination,
                                  start_destination_lat: JSON.parse(data.start_destination).latitude,
                                  start_destination_lng: JSON.parse(data.start_destination).longitude,
                                  end_destination_lat: JSON.parse(data.end_destination).latitude,
                                  end_destination_lng: JSON.parse(data.end_destination).longitude,

                                  id : id
                               }
                               console.log('home page constants',driverLocationConstants.location);
                               $state.go('core.request_screen')
                              
                           }else if(data.status === "account_approved"){
                                swal({
                                  title: title,
                                  text: body,
                                  type: "success"
                                },
                                function(){
                                 $state.go('core.home')
                                })
                           }else{
                                // Insuffient balance alert
                                swal({
                                      title: title,
                                      text: body,
                                      type: "warning",
                                      confirmButtonColor: "#3232ff",   
                                      confirmButtonText: "Recharge", 
                                      showCancelButton: true, 
                                      closeOnConfirm: false
                                  },
                                  //On click of recharge button
                                      function(){
                                       var url = appSettings.serverPath + appSettings.serviceApis.driver_recharge;
                                        services.funcPostRequest(url).then(function(response) {
                                          $scope.remaining_balance = response.data.toll_credit;
                                          swal("Remaining Balance", "You've " +"$"+ $scope.remaining_balance+ " in your account","success")
                                          $state.go('core.home')
                                        }, function(error) {
                                            notify({ classes: 'alert-danger', message: error });
                                        });
                                      //$state.go('core.home')
                                    })
                          }
                                          
                         }
                },
                function(msg){
                   //alert('onNotification callback successfully registered: ' + msg);
                },
                function(err){
                   //alert('Error registering onNotification callback: ' + err);
                 }  
                );

                var url = appSettings.serverPath + appSettings.serviceApis.getTopicName;
                services.funcGetRequest(url).then(function(response,status) {
                  if(response && response.data){
                    $scope.topicName = response.data.topic;
                   //alert($scope.topicName)
                   FCMPlugin.subscribeToTopic($scope.topicName);
                   //alert($scope.topicName)
                  }
                 
                 
                },function(error){
                      notify({ classes: 'alert-danger', message: response.message });
                });
              
                //FCMPlugin.subscribeToTopic('topicExample');
   
                                             
                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
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

