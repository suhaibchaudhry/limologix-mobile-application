'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the LimoCordova
 */
app
    .controller('MainCtrl', function($scope, $http, $translate,cordova) {

        cordova.ready.then(function() {
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
         });
        
        });
