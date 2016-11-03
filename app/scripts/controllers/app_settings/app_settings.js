'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:appSettingCtrl
 * @description
 * # appSettingCtrl
 * Controller of the LimoCordova
 */
app
    .controller('appSettingCtrl', ['$scope', '$state', '$http', '$rootScope',
        function($scope, $state, $http, $rootScope) {

            $rootScope.preState = $state.current.name;
            localStorage.setItem("lastState", $rootScope.preState);


            //Store auth-token - After login and app kills
            $http.defaults.headers.common['Auth-Token'] = localStorage.getItem('Auth-Token');

            $scope.go_online = function() {
                $state.go('core.home');
                //$state.go('core.passenger_boarded');
            }

        }
    ]);