'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the LimoCordova
 */
app
    .controller('MainCtrl', function($scope, $rootScope, $http, $translate, $state) {
        document.addEventListener("deviceready", onDeviceReady, false);


        function onDeviceReady() {
            checkConnection();
        }
        //Handles Network connectivity 
        function checkConnection() {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            alert('Connection type: ' + states[networkState]);

            //Event listeners when device lost/gets internet connection
            document.addEventListener("offline", onOffline, false);
            document.addEventListener("online", onOnline, false)
        }

        function onOffline() {
            $('#wrap').fadeTo("slow", 0.8);
            $('#wrap').css("pointer-events", "none");
            $("body").append("<p id='internet_connection_msg'>Internet connection appears to be offline</p>");
            $('body').animate({ scrollTop: $(document).height() }, 1000);
            //alert('The internet connection appears to be offline') 
            //window.location.reload();           
        }

        function onOnline() {
            $('#wrap').fadeTo("slow", 1);
            $('#wrap').css("pointer-events", "");
            $("#internet_connection_msg").remove();
            //alert('online');
        }

        $rootScope.online = navigator.onLine;
        if (!$rootScope.online) {
            alert('show network')
            $("body").append("<p id='internet_connection_msg'>Internet connection appears to be offline</p>");
        } else {
            $state.go('core.splash');
        }

        cordova.plugins.diagnostic.isLocationEnabledSetting(function(enabled) {
            console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
            if (enabled) {
                alert('location on');
                // getCurrentPosition();
            } else {
                swal({
                        title: 'GPS',
                        text: 'Turn On Location Services to allow "LimoLogix" to Determine Your Location',
                        type: "info",
                        confirmButtonText: 'Settings'
                    },
                    function() {
                        cordova.plugins.diagnostic.switchToSettings();
                    })
            }
        }, function(error) {
            console.error("The following error occurred: " + error);
        });

        // //Event listener when location services on/off
        // cordova.plugins.diagnostic.registerLocationAuthorizationStatusChangeHandler(function(status) {
        //     alert(status)
        //     console.log("Location authorization status changed from \"not_determined\" to: " + status);
        //     if (status == 'denied') {
        //         // if (typeof cordova.plugins.settings.openSetting != undefined) {
        //         //     cordova.plugins.settings.open(function() {
        //         //             alert("opened settings")
        //         //         },
        //         //         function() {
        //         //             alert("failed to open settings")
        //         //         });
        //         // }

        //         cordova.plugins.diagnostic.switchToSettings();
        //     } else {
        //         //getCurrentPosition();
        //     }
        // });


        function getCurrentPosition() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(p) {
                    var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                    var mapOptions = {
                        center: LatLng,
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    $scope.map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
                    $scope.marker = new google.maps.Marker({
                        position: LatLng,
                        map: $scope.map,
                        icon: 'images/driver/location_ping.0b6a1b43.png'
                            //title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
                    });
                    // google.maps.event.addListener(marker, "click", function(e) {
                    //     var infoWindow = new google.maps.InfoWindow();
                    //     infoWindow.setContent(marker.title);
                    //     infoWindow.open($scope.map, marker);
                    // });
                });
            } else {
                alert('Geo Location feature is not supported in this browser.');
            }
        }

        // cordova.plugins.diagnostic.registerLocationStateChangeHandler(function(state){
        //        if(
        //            (device.platform === "Android" && state !== cordova.plugins.diagnostic.locationMode.LOCATION_OFF)
        //            || (device.platform === "iOS") && ( state === cordova.plugins.diagnostic.permissionStatus.GRANTED
        //                || state === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE)
        //        )
        //            {
        //            alert("Location is available");
        //        }else{
        //            alert('location not available')
        //        }
        //    });



        //cordova.ready.then(function() {
        $scope.main = {
            title: 'Limo Logix',
            settings: {
                navbarHeaderColor: 'scheme-default',
                sidebarColor: 'scheme-default',
                brandingColor: 'scheme-default',
                activeColor: 'default-scheme-color',
                headerFixed: true,
                asideFixed: true,
                rightbarShow: false
            }
        };

        $scope.ajaxFaker = function() {
            $scope.data = [];
            var url = 'http://www.filltext.com/?rows=10&fname={firstName}&lname={lastName}&delay=5&callback=JSON_CALLBACK';

            $http.jsonp(url).success(function(data) {
                $scope.data = data;
                angular.element('.tile.refreshing').removeClass('refreshing');
            });
        };

        $scope.changeLanguage = function(langKey) {
            $translate.use(langKey);
            $scope.currentLanguage = langKey;
        };
        $scope.currentLanguage = $translate.proposedLanguage() || $translate.use();
        //});

    });