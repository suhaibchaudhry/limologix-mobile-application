'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the LimoCordova
 */
app
    .controller('DashboardCtrl', ['$scope',
        '$http',
        'AppConstants',
        function($scope, $http, constant) {
            $scope.page = {
                title: 'Dashboard',
                subtitle: 'Place subtitle here...'
            };

            $scope.loggedUser = constant.driver.username;
        }
    ]);
