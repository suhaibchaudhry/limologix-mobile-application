'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:appSettingCtrl
 * @description
 * # appSettingCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('appSettingCtrl',[
    '$scope',
    '$state',
    '$http',
    function ($scope,$state,$http) {
      $scope.go_online = function() {
        console.log('asda');
        $state.go('core.home');
      };
    }]);
