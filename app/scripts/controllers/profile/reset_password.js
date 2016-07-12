'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:ResetPasswordCtrl
 * @description
 * # ResetPasswordCtrl
 * Controller of the LimoCordova
 */
app
    .controller('ResetPasswordCtrl', ['notify', '$scope', '$http', 'appSettings', 'services', '$state','countriesConstant',
        function(notify, $scope, $http, appSettings, services, $state,constant) {
            $scope.page = {
                title: 'Reset Password',
                subtitle: '' //'Place subtitle here...'
            };

            $scope.resetPwd = {
                userName: '',
                password: '',
                cnfpassword: ''

            }
            $scope.resetPwd = {};
            $scope.resetPwd.userName = constant.user.name;
            $scope.funcresetPassword = function(isValid) {
                if ($scope.resetPwd.password !== $scope.resetPwd.cnfpassword) {
                    $scope.resetPwd.password = $scope.resetPwd.cnfpassword = '';
                    notify({ classes: 'alert-danger', message: 'Password and confirm password does not match' });
                    return;
                };
                var user = {
                    username: $scope.resetPwd.userName,
                    password: $scope.resetPwd.password
                };
                var url = appSettings.serverPath + appSettings.serviceApis.resetPassword;
                services.funcPostRequest(url, { "user": user }).then(function(response) {
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('app.profile.my_account');
                }, function(error, status) {
                    if (error)
                        notify({ classes: 'alert-danger', message: error.message });
                })
            };

        }
    ]);
