'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:splashCtrl
 * @description
 * # splashCtrl
 * Controller of the LimoCordova
 */
app
    .controller('splashCtrl', ['$scope', '$rootScope','$state', '$http', '$window', 'services', '$location',
        function($scope, $rootScope, $state, $http, $window, services, $location) {
           
            angular.element(document).ready(function() {
                console.log('page loading completed');
                rendersplashscreen();
            });


            //alert($rootScope.isLoggedIn);
            var isLoggedIn =  localStorage.getItem('isLoggedIn');

            if(isLoggedIn === "true"){
                $state.go('core.home');
            }else{
                $state.go('core.splash');
            }

 
            // setTimeout(function() {
            //     rendersplashscreen();
            //     // Do something after 1 second 
            // }, 500);

            function rendersplashscreen() {
                var totalheight = jQuery(window).outerHeight();
                var company_driver_height = totalheight - jQuery('.splash_header').outerHeight();
                var div_height = company_driver_height / 2;
                jQuery('.splash_company').height(div_height);
                jQuery('.splash_company').css('line-height',div_height+'px');
                jQuery('.splash_driver').height(div_height);
                jQuery('.splash_driver').css('line-height',div_height+'px');
            }

            $scope.moveto_admin_panel = function() {
                //$window.open("http://limologix.softwaystaging.com","_blank");
               // if(navigator.onLine){
                   window.location.href  = 'http://limologix.softwaystaging.com';
               // }
                
                // $location.path("http://limologix.softwaystaging.com");
            };
            $scope.moveto_app = function() {  
                //$state.go('core.signup');
               // $scope.$apply(function(){
                //if(navigator.onLine){
                    $location.path("core/login");
                //}
               // });
            };
        }
    ]);
