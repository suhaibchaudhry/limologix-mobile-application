'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the limoLogixApp
 */
app
  .controller('LoginCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','countriesConstant',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants) {
  	$scope.user = {
      	username :'',
      	password:''
    };
    $scope.login = function() {
      $scope.user = {
      	username : $scope.user.username,
      	password : $scope.user.password
      }
      var url = appSettings.serverPath + appSettings.serviceApis.signin;
      services.funcPostRequest(url,$scope.user).then(function(response){
            $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
            $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
            constants.user = response.data;
            constants.user.name = response.data.username;
            $window.sessionStorage['user'] = JSON.stringify(constants.user);
            $state.go('app.company.details');         
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.login');
       });
    };
  }]);
