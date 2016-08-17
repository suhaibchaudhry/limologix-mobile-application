'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the LimoCordova
 */
app
  .controller('LoginCtrl',
    ['$scope','$state','$http','appSettings','notify','$window','services','AppConstants',
    function ($scope, $state,$http,appSettings,notify, $window,services, constants) {
  	$scope.driver = {
      	email :'',
      	password:''
    };
    $scope.login = function() {
      $scope.driver = {
      	email : $scope.driver.email,
      	password : $scope.driver.password
      }
      var url = appSettings.serverPath + appSettings.serviceApis.signin;
      services.funcPostRequest(url,$scope.driver).then(function(response){
            $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
            $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
            constants.driver = response.data;
            constants.driver.name = response.data.full_name;
            constants.driver.company_name = response.data.company;
            $window.sessionStorage['driver'] = JSON.stringify(constants.driver);
            //$state.go('core.appSettings');   
            $state.go('core.home');          
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.login');
       });
    };
  }]);
