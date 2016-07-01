'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:availabilityCtrl
 * @description
 * # availabilityCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('availabilityCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','AppConstants',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants) {
    // funcGetVisibleStatus();
    $scope.visible_status = false;
    function funcGetVisibleStatus(){
         
     var url = appSettings.serverPath + appSettings.serviceApis.getVisibleStatus;
        var postData = {
            "driver":{
                "visible" : $scope.visible_status
            }
        };
        services.funcPostRequest(url, postData).then(function(response) {
            $scope.status1 = response.data;
            console.log("sstatusssss",$scope.status1);
        });
        }
  }]);
