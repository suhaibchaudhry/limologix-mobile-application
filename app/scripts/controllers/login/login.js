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
    ['$scope', '$rootScope','$state','$http','appSettings','notify','$window','services','AppConstants',
    function ($scope, $rootScope,$state,$http,appSettings,notify, $window,services, constants) {
  	$scope.driver = {
      	email :'',
      	password:''
    };

               if (localStorage.chkbx && localStorage.chkbx != '') {
                    $('#remember_me').attr('checked', 'checked');
                    $scope.driver.email = localStorage.usrname;
                    $scope.driver.password = localStorage.password;
                } else {
                    $('#remember_me').removeAttr('checked');
                    $scope.driver.email = '';
                    $scope.driver.password = '';
                }
 
                $('#remember_me').click(function() {
 
                    if ($('#remember_me').is(':checked')) {
                        // save email and passwordword
                        localStorage.usrname = $scope.driver.email;
                        localStorage.password = $scope.driver.password;
                        localStorage.chkbx = $('#remember_me').val();
                    } else {
                        localStorage.usrname = '';
                        localStorage.password = '';
                        localStorage.chkbx = '';
                    }
                });
           


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
            $rootScope.isAdsShow = true;
            //$state.go('core.appSettings');   
            $state.go('core.appSettings');   
            notify.closeAll();       
            notify({ classes: 'alert-success',message:response.message});
       }, function(error){
           if(error && error.message)
            notify.closeAll();  
           notify({ classes: 'alert-danger', message: error.message });
           $state.go('core.login');
       });
    };
  }]);
