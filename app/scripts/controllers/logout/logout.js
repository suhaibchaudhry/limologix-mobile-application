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
    ['$scope', '$rootScope','$state','$http','appSettings','notify','$window','services','AppConstants','Faye',
    function ($scope, $rootScope, $state,$http,appSettings,notify, $window,services, constants,Faye) {
  	  var url = appSettings.serverPath + appSettings.serviceApis.logout;
      var token = $window.sessionStorage['Auth-Token'];
      services.funcGetRequest(url).then(function(response,status) {
          $state.go('core.splash');   
          constants.driver = {};
          clearInterval($rootScope.FreeAds); // freeAds
          localStorage.setItem('isLoggedIn',false);

          var client = Faye.getClient();
          client.disable('autodisconnect');

          notify({ classes: 'alert-success',message:response.message});
         // delete $window.sessionStorage['Auth-Token'];
      },function(error){
          notify({ classes: 'alert-danger', message: response.message });
          $state.go('core.login');
          //delete $window.sessionStorage['Auth-Token'];
      });
}]);
