'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:DirverSignupCtrl
 * @description
 * # DirverSignupCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('DirverSignupCtrl', [
        '$scope',
        '$state',
        '$http',
        'appSettings',
        'notify',
        '$window',
        'services',
        function($scope, $state, $http, appSettings, notify, $window, services) {
            var self = this;
            self.defaultDropdownStrings = [
                'China',
                'Sweden',
                'United Kingdom',
                'United States'
            ];
            $scope.phoneNumbr = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            $scope.options = ['var1', 'var2', 'var3'];
            $scope.contact = {};
            $scope.isContact = true;
            $scope.isPersonal = false;
            $scope.isVehicle = false;
            $scope.isAccount = false;

            var data = localStorage.getItem('driverdata');
            $scope.contactinfo = JSON.parse(data);
            $scope.contact = {
                fullName: $scope.contactinfo.fullName,
                lastName: $scope.contactinfo.lastName,
                email: $scope.contactinfo.email,
                password: $scope.contactinfo.password,
                phoneNumbr: $scope.contactinfo.primary_phone_number,
                primary_address: $scope.contactinfo.primary_address,
                city: $scope.contactinfo.city,
                state: $scope.contactinfo.state,
                zipcode: $scope.contactinfo.zipcode
            }
            console.log('sdd', data);
            //File uploads for Licence plate and ARA photos.
            $scope.DriverLicenceUpload = function() {
                $("input[id='dlPic']").click();
            }
            $scope.ARAUpload = function() {
                $("input[id='araPic']").click();
            }

            function readURL(input, bool) {

                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        if (bool == 0)
                            $('#dlImg').attr('src', e.target.result);
                        else
                            $('#araImg').attr('src', e.target.result);
                        console.log('dsds', e.target, input.files[0])
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            }

            $("#dlPic").change(function() {
                readURL(this, 0);
            });
            $("#araPic").change(function() {
                readURL(this, 1);
            });

            $scope.save_contactInfo = function() {
                $scope.contactinfo = {
                    fullName: $scope.contact.fullName,
                    lastName: $scope.contact.lastName,
                    email: $scope.contact.email,
                    password: $scope.contact.password,
                    phoneNumbr: $scope.contact.primary_phone_number,
                    primary_address: $scope.contact.primary_address,
                    city: $scope.contact.city,
                    state: $scope.contact.state,
                    zipcode: $scope.contact.zipcode
                }
                localStorage.setItem("driverdata", JSON.stringify($scope.contactinfo));
                var data = localStorage.getItem('driverdata');
                $scope.contactinfo = JSON.parse(data);
                $scope.contact = {
                        fullName: $scope.contactinfo.fullName,
                        lastName: $scope.contactinfo.lastName,
                        email: $scope.contactinfo.email,
                        password: $scope.contactinfo.password,
                        phoneNumbr: $scope.contactinfo.primary_phone_number,
                        primary_address: $scope.contactinfo.primary_address,
                        city: $scope.contactinfo.city,
                        state: $scope.contactinfo.state,
                        zipcode: $scope.contactinfo.zipcode
                    }
                    //console.log(data);
            }
            $scope.Contact_Next = function() {
                $scope.isContact = false;
                $scope.isPersonal = true;
                $scope.isVehicle = false;
            }
            $scope.Personal_Next = function() {
                $scope.isContact = false;
                $scope.isPersonal = false;
                $scope.isVehicle = true;
            }
            $scope.submitDriverForm = function() {
                $scope.isAccount = true;
                $scope.isContact = false;
                $scope.isPersonal = false;
                $scope.isVehicle = false;
            }

            $scope.register = function() {

                //                 var driver = {
                //                     "driver": {
                //                         "first_name": "John",
                //                         "last_name": "Joseph",
                //                         "password": "123456",
                //                         "mobile_number": "1234567890",
                //                         "email": "john@gmail.com",
                //                         "address": {
                //                             "street": "#12,fdf",
                //                             "city": "fdfd",
                //                             "zipcode": "560102",
                //                             "state_code": "KA",
                //                             "country_code": "IN"
                //                         },
                //                         "license_number": "22323",
                //                         "license_expiry_date": "03/02/2018",
                //                         "license_image": {
                //                             "name": "img.1.png",
                //                             "image": "base64path"
                //                         },
                //                         "badge_number": "24234",
                //                         "badge_expiry_date": "03/02/2018",
                //                         "ara_number": "324",
                //                         "ara_expiry_date": "03/02/2018",
                //                         "ara_image": {
                //                             "name": "img2.png",
                //                             "image": "base64path"
                //                         },
                //                         "insurance_company": "ddfg",
                //                         "insurance_policy_number": "34242",
                //                         "insurance_expiry_date": "09/09/2019"
                //                     },
                //                     "vehicle": {
                //                         "make": "dsd",
                //                         "model": "dsddssdd",
                //                         "hll_number": "2313",
                //                         "color": "black",
                //                         "license_plate_number": "324234",
                //                         "vehicle_type_id": "3",
                //                         "features": ["feature1", "feature2"]
                //                     }
            }

            //                 var driver = {
            //                     username: $scope.driver.username,
            //                     first_name: $scope.driver.fullName,
            //                     last_name: $scope.driver.lastName,
            //                     home_phone_number: $scope.driver.homePhone,
            //                     mobile_number: $scope.driver.primary_phone_number,
            //                     fax_number: $scope.driver.faxNumber,
            //                     email: $scope.driver.email,
            //                     password: $scope.driver.password
            //                 }

            //                 var url = appSettings.serverPath + appSettings.serviceApis.registration;
            //                 services.funcPostRequest(url, { "driver": driver }).then(function(response) {
            //                     $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
            //                     $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
            //                     $state.go('app.dashboard');
            //                     notify({ classes: 'alert-success', message: response.message });
            //                 }, function(error) {
            //                     if (error.message)
            //                         notify({ classes: 'alert-danger', message: error.message });
            //                     $state.go('core.signup');
            //                 })
        }
        // }
    ]);
