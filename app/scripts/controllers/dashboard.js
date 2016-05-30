'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the minovateApp
 */
app
  .controller('DashboardCtrl',[
      '$scope',
      '$http',
      '$rootScope',
      '$window',
      'appSettings',
      'services',
      'countriesConstant',
  function($scope,$http,$rootScope,$window,appSettings,services,constant){
    $scope.page = {
      title: 'Dashboard',
      subtitle: 'Place subtitle here...'
    };

    getCompanyInfo();
    function getCompanyInfo(){
       if(constant.user['Auth-Token']){
         var url = appSettings.serverPath + appSettings.serviceApis.company_info;
         services.funcGetRequest(url).then(function(response){
            var response = response.data.company;
            $scope.companyInfo = {
              logoUrl:response.logo.image
            }
             displayLogo();
         }, function(error){
             
         })
       
       }
     }
    function displayLogo(){
      $scope.picFilePreview = appSettings.server_address + $scope.companyInfo.logoUrl;
    }
}]);



