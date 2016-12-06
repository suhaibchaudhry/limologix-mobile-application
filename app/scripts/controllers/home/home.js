'use strict';

/**
 * @ngdoc function
 * @name Limo Logix.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the Limo Logix
 */
app
    .controller('homeCtrl', ['MapServices', '$scope', '$rootScope', '$state', '$http', 'appSettings', 'notify', '$window', 'services', 'AppConstants', '$timeout', '$location', 'Faye', 'driverLocationConstants', funchomeCtrl])


function funchomeCtrl(MapServices, $scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants, $timeout, $location, Faye, driverLocationConstants) {

    $scope.deviceOnline = navigator.onLine; //$rootScope.online;
    var driver_name = localStorage.getItem('driver_name');
    var comp_name = localStorage.getItem('company_name');
    $scope.driver_name = driver_name ? driver_name : '';
    $scope.company_name = comp_name ? comp_name : '';
    $scope.showAds = false;
    $scope.cntrlName = "home";
    //MapServices.cntrlScope = $scope;

    $rootScope.preState = $state.current.name;
    localStorage.setItem("lastState", $rootScope.preState);

    $scope.$watchGroup(['cntrlName', 'tripsummary', 'address_type'], function() {
            MapServices.cntrlName = $scope.cntrlName;
            MapServices.tripsummary = '';
        })
        //Store auth-token - After login and app kills
    $http.defaults.headers.common['Auth-Token'] = localStorage.getItem('Auth-Token');

    var windowHeight = jQuery(window).innerHeight();
    var mapHeight = windowHeight - ($(".navbar-header").height() + $(".footer-text").height());
    $('#dvMap').height(mapHeight + 'px');
    $('#dvMap').css({ 'top': '10%' });


    var galleryBottomPos = $('#dvMap').position().top; //+ $(".footer-text").height();
    // $("#slide_cont").css({'bottom':(galleryBottomPos-20)+'px'})
    $("#slide_cont").css({ 'bottom': '30%' })
    var galleryImgLeftPos = ($(window).innerWidth() - $('#slideshow_image').innerWidth()) / 2;
    $("#slideshow_image").css({ 'left': galleryImgLeftPos + 'px' })

    $('body').removeClass('menu-slider');
    $('body').removeClass('in');

    // Toggle classes in body for syncing sliding animation with other elements
    $('#bs-example-navbar-collapse-2')
        .on('show.bs.collapse', function(e) {
            $('body').addClass('menu-slider');
        })
        .on('shown.bs.collapse', function(e) {
            $('body').addClass('in');
        })
        .on('hide.bs.collapse', function(e) {
            $('body').removeClass('menu-slider');
        })
        .on('hidden.bs.collapse', function(e) {
            $('body').removeClass('in');
        });

    if ($rootScope.isAdsShow) {
        displayAds();
    } else {
        $rootScope.FreeAds = setInterval(function() {
            displayAds();
        }, 1800000)
    }


    function displayAds() {
        var imagesArr = [];
        var url = appSettings.serverPath + appSettings.serviceApis.displayAdvertisements;
        services.funcPostRequest(url, { "page": 0, "per_page": 0 }).then(function(response) {

            if (response.data) {
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
            } else {
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

    if ($rootScope.status !== undefined) {
        $scope.status = $rootScope.status;
    } else {
        $scope.status = true;
    }

    $scope.init = function() {
        $scope.status = $scope.status;
    }

    $scope.funcGetVisibleStatus = function() {
        $scope.status = !$scope.status;
        $rootScope.status = $scope.status;
        var postData = {
            "driver": {
                "visible": $rootScope.status
            }
        };

        var url = appSettings.serverPath + appSettings.serviceApis.getVisibleStatus;
        services.funcPostRequest(url, postData).then(function(response) {
            notify.closeAll();
            notify({ classes: 'alert-success', message: response.message });
        }, function(error) {
            if (error && error.message) {
                notify.closeAll();
                notify({ classes: 'alert-danger', message: error.message });
            }
        });
    }


    $scope.funcCloseAds = function() {
        $("#slide_cont").hide();
    }

    //Push notifications from FCM

    FCMPlugin.getToken(
            function(token) {
                //alert(token);
                console.log('FCM Token');
                console.log(token);
            },
            function(err) {
                console.log('error retrieving token: ' + err);
            }
        )
    //Receive notification from FCM
    FCMPlugin.onNotification(
        function(data) {
          console.log('Notification: ');
          console.log('data', data); 
            if (data.wasTapped) {
                //Notification was received on device tray and tapped by the user.
                if (data.aps) {
                    var title = data.aps.alert.title;
                    var body = data.aps.alert.body;
                } else {
                    var title = data.title;
                    var body = data.body;
                }

                // get ride request alert
                if (data.status === "dispatched") {
                    var end_destination = JSON.parse(data.end_destination).place;
                    var start_destination = JSON.parse(data.start_destination).place;

                    var id = data.id;

                    driverLocationConstants.location = {
                        end_destination: end_destination,
                        start_destination: start_destination,
                        start_destination_lat: JSON.parse(data.start_destination).latitude,
                        start_destination_lng: JSON.parse(data.start_destination).longitude,
                        end_destination_lat: JSON.parse(data.end_destination).latitude,
                        end_destination_lng: JSON.parse(data.end_destination).longitude,
                        customer_name: data.full_name,
                        company_name: data.company_name,
                        price: data.price,
                        id: id,
                        source_place_id: data.source_place_id,
                        destination_place_id: data.destination_place_id,
                    }
                    var stored_notification = JSON.stringify(driverLocationConstants.location);
                    localStorage.setItem('notificationInfo', stored_notification);
                    $state.go('core.request_screen')

                } else if (data.status === "account_approved") {
                    swal({
                            title: title,
                            text: body,
                            type: "success"
                        },
                        function() {
                            $state.go('core.home')
                        })
                } else if (data.status === "trip_cancellation") {
                    swal({
                            title: title,
                            text: body,
                            type: "warning"
                        },
                        function() {
                            $state.go('core.home')
                        })
                } else {
                    // Insuffient balance alert
                    swal({
                            title: title,
                            text: body,
                            type: "warning"
                                // confirmButtonColor: "#3232ff",
                                // confirmButtonText: "Recharge",
                                // showCancelButton: true,
                                // closeOnConfirm: false
                        },
                        //On click of recharge button
                        function() {
                            $state.go('core.home')
                        })
                }


                driverLocationConstants.location = {
                    end_destination: end_destination,
                    start_destination: start_destination,
                    start_destination_lat: JSON.parse(data.start_destination).latitude,
                    start_destination_lng: JSON.parse(data.start_destination).longitude,
                    end_destination_lat: JSON.parse(data.end_destination).latitude,
                    end_destination_lng: JSON.parse(data.end_destination).longitude,
                    customer_name: data.full_name,
                    company_name: data.company_name,
                    price: data.price,
                    id: id,
                    source_place_id: data.source_place_id,
                    destination_place_id: data.destination_place_id,
                }
                console.log('home page constants', driverLocationConstants.location);


            } else {
                //Notification was received in foreground. Maybe the user needs to be notified.
                if (data.aps) {
                    var title = data.aps.alert.title;
                    var body = data.aps.alert.body;
                } else {
                    var title = data.title;
                    var body = data.body;
                }
                // get ride request alert
                if (data.status === "dispatched") {
                    var end_destination = JSON.parse(data.end_destination).place;
                    var start_destination = JSON.parse(data.start_destination).place;
                    var id = data.id;

                    driverLocationConstants.location = {
                        end_destination: end_destination,
                        start_destination: start_destination,
                        start_destination_lat: JSON.parse(data.start_destination).latitude,
                        start_destination_lng: JSON.parse(data.start_destination).longitude,
                        end_destination_lat: JSON.parse(data.end_destination).latitude,
                        end_destination_lng: JSON.parse(data.end_destination).longitude,
                        customer_name: data.full_name,
                        price: data.price,
                        company_name: data.company_name,
                        id: id,

                        source_place_id: data.source_place_id,
                        destination_place_id: data.destination_place_id,
                    }
                    var stored_notification = JSON.stringify(driverLocationConstants.location);
                    localStorage.setItem('notificationInfo', stored_notification);
                    $state.go('core.request_screen')

                } else if (data.status === "account_approved") {
                    swal({
                            title: title,
                            text: body,
                            type: "success"
                        },
                        function() {
                            $state.go('core.home')
                        })
                } else if (data.status === "trip_cancellation") {
                    swal({
                            title: title,
                            text: body,
                            type: "warning"
                        },
                        function() {
                            $state.go('core.home')
                        })
                } else {
                    // Insuffient balance alert
                    swal({
                            title: title,
                            text: body,
                            type: "warning"
                                // confirmButtonColor: "#3232ff",
                                // confirmButtonText: "Recharge",
                                // showCancelButton: true,
                                // closeOnConfirm: false
                        },
                        //On click of recharge button
                        function() {
                            $state.go('core.home')
                        })
                }

            }
        },
        function(msg) {
            //alert('onNotification callback successfully registered: ' + msg);
        },
        function(err) {
            //alert('Error registering onNotification callback: ' + err);
        }
    );
    
    var url = appSettings.serverPath + appSettings.serviceApis.getTopicName;
    services.funcGetRequest(url).then(function(response, status) {
        if (response && response.data) {
            $scope.topicName = response.data.topic;
            console.log('FCM Topic: '+$scope.topicName);
            setInterval(function() {
                FCMPlugin.subscribeToTopic($scope.topicName);
            }, 1000)
            $rootScope.topicName = $scope.topicName;
        }

    }, function(error) {
        notify({ classes: 'alert-danger', message: response.message });
    });

    MapServices.init('dvMap');
}
