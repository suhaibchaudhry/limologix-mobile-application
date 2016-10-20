'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:appSettingCtrl
 * @description
 * # appSettingCtrl
 * Controller of the LimoCordova
 */
app
    .controller('appSettingCtrl', ['$scope', '$state', '$http',
        function($scope, $state, $http) {
            
            $scope.go_online = function() {
                $state.go('core.home');
                //$state.go('core.passenger_boarded');
            }
            
        }
    ]);
