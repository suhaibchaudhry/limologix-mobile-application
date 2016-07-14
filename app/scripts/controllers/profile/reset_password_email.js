'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:resetPassEmailCtrl
 * @description
 * # resetPassEmailCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('resetPassEmailCtrl', ['notify', '$scope', '$http', 'appSettings', 'services', '$state', 'countriesConstant','$location',
        function(notify, $scope, $http, appSettings, services, $state, constant, $location) {
            $scope.url = {};
            $scope.token = $location.search().token;
            $scope.resetPwd = {
                password: '',
                cnfpassword: ''

            }
            $scope.funcResetPassword = function() {
                if ($scope.resetPwd.password !== $scope.resetPwd.cnfpassword) {
                    $scope.resetPwd.password = $scope.resetPwd.cnfpassword = '';
                    notify({ classes: 'alert-danger', message: 'Password and confirm password does not match' });
                    return;
                };
                var user = {
                    password: $scope.resetPwd.password,
                    reset_password_token:$scope.token
                };
                var url = appSettings.serverPath + appSettings.serviceApis.restpasswrdfromemail;
                services.funcPostRequest(url,{"user": user}).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.login');
                }, function(error, status) {
                    if (error)
                        notify({ classes: 'alert-danger', message: error.message });
                })
            };

        }
    ]);
