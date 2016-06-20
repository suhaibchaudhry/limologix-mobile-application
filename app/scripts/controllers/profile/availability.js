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
//   	$scope.driver = {
//       	username :'',
//       	password:''
//     };
//     $scope.login = function() {
//       $scope.driver = {
//       	username : $scope.driver.username,
//       	password : $scope.driver.password
//       }
//       var url = appSettings.serverPath + appSettings.serviceApis.signin;
//       services.funcPostRequest(url,$scope.driver).then(function(response){
//             $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
//             $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
//             constants.driver = response.data;
//             constants.driver.name = response.data.username;
//             $window.sessionStorage['driver'] = JSON.stringify(constants.driver);
//             $state.go('app.dashboard');         
//             notify({ classes: 'alert-success',message:response.message});
//        }, function(error){
//            if(error && error.message)
//            notify({ classes: 'alert-danger', message: error.message });
//            $state.go('core.login');
//        });
//     };
  }]);
