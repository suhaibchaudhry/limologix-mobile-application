'use strict';

/**
 * @ngdoc function
 * @name Limo Logix .controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the Limo Logix
 */
app
    .controller('MainCtrl', function($scope, $rootScope, $http, $translate, $state, $stateParams) {
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

            // alert('Connection type: ' + states[networkState]);

            //Event listeners when device lost/gets internet connection
            document.addEventListener("offline", onOffline, false);
            document.addEventListener("online", onOnline, false)
        }

        function onOffline() {
            //alert('offline event')
            $('#wrap').css("pointer-events", "none").fadeTo("slow", 0.8);
            $("body").append("<p id='internet_connection_msg'>Internet connection appears to be offline</p>");
            $('body').animate({ scrollTop: $(document).height() }, 1000);
            //alert('The internet connection appears to be offline')
            //window.location.reload();
        }

        function onOnline() {
            $('#wrap').css("pointer-events", "").fadeTo("slow", 1);
            $("#internet_connection_msg").remove();
            // $state.transitionTo($state.current,$stateParams,{
            //     reload:true,inherit:false,notify:true
            // });
            window.location.reload();
        }

        cordova.plugins.diagnostic.isLocationEnabledSetting(function(enabled) {
            console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
            if (enabled) {
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