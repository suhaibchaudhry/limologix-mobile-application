'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the LimoCordova
 */
app
  .controller('LogoutCtrl',
    ['$scope', '$rootScope','$state','$http','appSettings','notify','$window','services','AppConstants',
    function ($scope, $rootScope, $state,$http,appSettings,notify, $window,services, constants) {
  	  var url = appSettings.serverPath + appSettings.serviceApis.logout;
      var token = $window.sessionStorage['Auth-Token'];
      services.funcGetRequest(url).then(function(response,status) {
          $state.go('core.login');   
          constants.driver = {};
          //clearInterval($rootScope.getLoc);  // get driver current location  - Distance calculation
          //clearInterval($rootScope.getDestLoc);   // get destination location - Distance caculation
          clearInterval($rootScope.FreeAds); // freeAds
          notify({ classes: 'alert-success',message:response.message});
         // delete $window.sessionStorage['Auth-Token'];
      },function(error){
          notify({ classes: 'alert-danger', message: response.message });
          $state.go('core.login');
          //delete $window.sessionStorage['Auth-Token'];
      });
}]);
