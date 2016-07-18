'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:availabilityCtrl
 * @description
 * # availabilityCtrl
 * Controller of the LimoCordova
 */
app
  .controller('availabilityCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','AppConstants',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants) {

        $scope.init = function(){
                $scope.status = true;
            }
            $scope.funcGetVisibleStatus = function(){

                $scope.status = !$scope.status;
                var postData = {
                    "driver": {
                        "visible": $scope.status
                    }
                };
                console.log("postData", postData);
                var url = appSettings.serverPath + appSettings.serviceApis.getVisibleStatus;
                services.funcPostRequest(url, postData).then(function(response) {
                    console.log("response", response);
                       notify({ classes: 'alert-success',message:response.message});
                }, function(error) {
                    if (error && error.message)
                        notify({ classes: 'alert-danger', message: error.message });
                    //$state.go('core.login');
                });
            }


    // funcGetVisibleStatus();
    // $scope.visible_status = false;    
    // function funcGetVisibleStatus(){
         
    //  var url = appSettings.serverPath + appSettings.serviceApis.getVisibleStatus;
    //     var postData = {
    //         "driver":{
    //             "visible" : $scope.visible_status
    //         }
    //     };
    //     services.funcPostRequest(url, postData).then(function(response) {
    //         $scope.status1 = response.data;
    //         console.log("sstatusssss",$scope.status1);
    //     });
    //     }
  }]);
