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
    ['$scope', '$rootScope','$state','$http','appSettings','notify','$window','services','AppConstants','Faye','MapServices',
    function ($scope, $rootScope, $state,$http,appSettings,notify, $window,services, constants,Faye,MapServices) {
  	  var url = appSettings.serverPath + appSettings.serviceApis.logout;
      var token = $window.sessionStorage['Auth-Token'];
      clearInterval(MapServices.checkGPS);

      services.funcGetRequest(url).then(function(response,status) {
          $state.go('core.splash');
          constants.driver = {};
          clearInterval($rootScope.FreeAds); // freeAds
          localStorage.setItem('isLoggedIn',false);
          localStorage.clear();
          FCMPlugin.unsubscribeFromTopic($rootScope.topicName);
          var client = Faye.getClient();
          client.disable('autodisconnect');


          var bgGeo = window.BackgroundGeolocation;
          bgGeo.stop();
          clearInterval($rootScope.getCurrentPositionsWithInterval);

          notify({ classes: 'alert-success',message:response.message});
      },function(error){
          notify({ classes: 'alert-danger', message: error.message });
          $state.go('core.login');
      });
}]);
