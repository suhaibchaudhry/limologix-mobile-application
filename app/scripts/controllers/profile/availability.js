'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:availabilityCtrl
 * @description
 * # availabilityCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('availabilityCtrl', ['$scope', '$rootScope', '$state', '$http', 'appSettings', 'notify', '$window', 'services', 'AppConstants',
        function($scope, $rootScope, $state, $http, appSettings, notify, $window, services, constants) {

           
            if ($rootScope.status !== undefined) {
                $scope.status = $rootScope.status;
            } else {
                $scope.status = true;
            }
           

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


            //funcGetVisibleStatus();
            $scope.init = function() {
                $scope.status = $scope.status;
            }
            $scope.save_status = function() {
                $rootScope.status = $scope.status;
                var postData = {
                    "driver": {
                        "visible": $rootScope.status
                    }
                };
                var url = appSettings.serverPath + appSettings.serviceApis.getVisibleStatus;
                services.funcPostRequest(url, postData).then(function(response) {
                    //console.log("response", response);
                }, function(error) {
                    if (error && error.message)
                        notify({ classes: 'alert-danger', message: error.message });
                    //$state.go('core.login');
                });
            }
            $scope.funcGetVisibleStatus = function() {

                $scope.status = !$scope.status;
            }
        }
    ]);
