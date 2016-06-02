'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('SignupCtrl', [
        '$scope',
        '$state',
        '$http',
        'appSettings',
        'notify',
        '$window',
        'services',
        function($scope, $state, $http, appSettings, notify, $window, services) {
            $scope.phoneNumbr = /^\+?\d{1}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            $scope.register = function() {
                var driver = {
                    username: $scope.driver.username,
                    first_name: $scope.driver.fullName,
                    last_name: $scope.driver.lastName,
                    home_phone_number: $scope.driver.homePhone,
                    mobile_number: $scope.driver.primary_phone_number,
                    fax_number: $scope.driver.faxNumber,
                    email: $scope.driver.email,
                    password: $scope.driver.password
                }

                var url = appSettings.serverPath + appSettings.serviceApis.registration;
                services.funcPostRequest(url,{"driver":driver}).then(function(response) {
                    $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
                    $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
                    $state.go('app.dashboard');
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    if (error.message)
                        notify({ classes: 'alert-danger', message: error.message });
                    $state.go('core.signup');
                })
            }
        }
    ]);
