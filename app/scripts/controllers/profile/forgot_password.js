'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:forgotPwdCtrl
 * @description
 * # forgotPwdCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('forgotPwdCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','countriesConstant',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants) {
  	          
            $scope.page = {
                title: 'Forgot Password',
                subtitle: '' //'Place subtitle here...'
            };

            $scope.forgotPwd = {
                email: ''
            }
            $scope.forgotPwd = {};
            $scope.funcForgotPassword = function() {
                var url = appSettings.serverPath + appSettings.serviceApis.forgotPassword;
                services.funcPostRequest(url, { "email": $scope.forgotPwd.email }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.login');
                }, function(error, status) {
                    if (error)
                        notify({ classes: 'alert-danger', message: error.message });
                })
            };
        }
    ]);