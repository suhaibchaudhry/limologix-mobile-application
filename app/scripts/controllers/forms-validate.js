'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:FormsValidateCtrl
 * @description
 * # FormsValidateCtrl
 * Controller of the minovateApp
 */
app
  .controller('FormsValidateCtrl', function ($scope,$rootScope,$http,appSettings) {
    $scope.page = {
      title: 'Company Information',
      subtitle: ''//'Place subtitle here...'
    };

    $scope.userInfo = {
        first_name:'demo',
        last_name:'xyz',
        user_name:'',
        password:'',
        mobile_number:'',
        email:'',
        uid :'',
        name:'',
        email:'',
        primary_phone_number:'',
        logo:'',
        secondary_phone_number:'',
        fax:'',
        street:'',
        city:'',
        //zipcode:'',
        state_code:'',
        country_code:''

    }

    // function to submit the form after all validation has occurred
		$scope.submitForm = function(isValid) {
      console.log('validate form',$scope.userInfo.logo);
      $rootScope.uploadedLogo = $scope.userInfo.logo;
			// check to make sure the form is completely valid
			// if (isValid) {
   //      var user = new Object();
   //        user.first_name = $scope.userInfo.first_name;
   //        user.last_name = $scope.userInfo.last_name;
   //        user.user_name = $scope.userInfo.user_name;
   //        user.password = $scope.userInfo.password;
   //        user.mobile_number = '123456789';
   //        user.email = $scope.userInfo.email;
   //      var company = new Object();
   //        company.uid = $scope.userInfo.uid;
   //        company.name = $scope.userInfo.name;
   //        company.email = $scope.userInfo.email;
   //        company.primary_phone_number = $scope.userInfo.primary_phone_number;
   //        //company.logo = $scope.userInfo.logo;
   //        company.secondary_phone_number = $scope.userInfo.secondary_phone_number;
   //        company.fax = $scope.userInfo.fax;
   //        company.address_attributes = {
   //          street:$scope.userInfo.street,
   //          city:$scope.userInfo.city,
   //          zipcode:0,
   //          state_code:$scope.userInfo.state_code,
   //          country_code:$scope.userInfo.country_code
   //        }
   //      var userDetails = {
   //         "user" : user,
   //         "company": company
   //      }
      
   //     var url = appSettings.serverPath + appSettings.serviceApis.signup;
   //     $http.post(url,userDetails).success( function(response) {
   //        $scope.userResponse = response; 
   //        console.log("response", $scope.userResponse);
   //     });

			// } else {
   //      console.log('form is invalid');
   //    }

		};

    $scope.notBlackListed = function(value) {
      var blacklist = ['bad@domain.com','verybad@domain.com'];
      return blacklist.indexOf(value) === -1;
    };
  });
