'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the limoLogixApp
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
