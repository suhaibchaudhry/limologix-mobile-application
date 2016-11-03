'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:resetPasswordCtrl
 * @description
 * # resetPasswordCtrl
 * Controller of the minovateApp
 */
app
    .controller('resetPasswordCtrl', ['notify', '$scope', '$rootScope', '$http', 'appSettings', 'services', '$state', 'AppConstants',
        function(notify, $scope, $rootScope, $http, appSettings, services, $state, constant) {
            $scope.page = {
                title: 'Reset Password',
                subtitle: '' //'Place subtitle here...'
            };

            $scope.resetPwd = {
                userName: '',
                password: '',
                cnfpassword: ''

            }

            $rootScope.preState = $state.current.name;
            localStorage.setItem("lastState", $rootScope.preState);

            //Store auth-token - After login and app kills
            $http.defaults.headers.common['Auth-Token'] = localStorage.getItem('Auth-Token');

            $scope.resetPwd = {};
            $scope.resetPwd.userName = localStorage.getItem('driver_name') //constant.driver.full_name;
            $rootScope.isAdsShow = false;

            //Fix for - Header moves down when device keyboard is open and when user scroll the screen
            var adWrapper = $('header');

            $(document).on('focusin', 'input, textarea', function() {
                    adWrapper.addClass('unfixed');
                })
                .on('focusout', 'input, textarea', function() {
                    adWrapper.removeClass('unfixed');
                });


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

            $scope.funcResetPassword = function(isValid) {
                if ($scope.resetPwd.password !== $scope.resetPwd.cnfpassword) {
                    $scope.resetPwd.password = $scope.resetPwd.cnfpassword = '';
                    notify({ classes: 'alert-danger', message: 'Password and confirm password does not match' });
                    return;
                };
                var driver = {
                    password: $scope.resetPwd.password
                };
                var url = appSettings.serverPath + appSettings.serviceApis.reset_auth_details;
                services.funcPostRequest(url, { "driver": driver }).then(function(response) {
                    notify.closeAll();
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.login');
                }, function(error, status) {
                    if (error) {
                        notify.closeAll();
                        notify({ classes: 'alert-danger', message: error.message });
                    }

                })
            };

        }
    ]);