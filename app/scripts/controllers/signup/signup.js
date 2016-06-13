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
            $scope.personal = {};
            $scope.vehicle = {};
            $scope.isContact = true;
            $scope.isPersonal = false;
            $scope.isVehicle = false;
            $scope.isAccount = false;


            var data = localStorage.getItem('driverdata');
            //             console.log("onload",data);
            $scope.contactinfo = JSON.parse(data)[0];
            if ($scope.contactinfo) {
                $scope.contact = {
                    fullName: $scope.contactinfo.fullName,
                    lastName: $scope.contactinfo.lastName,
                    email: $scope.contactinfo.email,
                    password: $scope.contactinfo.password,
                    primary_phone_number: $scope.contactinfo.primary_phone_number,
                    primary_address: $scope.contactinfo.primary_address,
                    city: $scope.contactinfo.city,
                    state: $scope.contactinfo.state,
                    zipcode: $scope.contactinfo.zipcode
                }
            }
            $scope.personalinfo = JSON.parse(data)[1];
            if ($scope.personalinfo) {
                $scope.personal = {
                    dl_number: $scope.personalinfo.dl_number,
                    dlPic: $scope.personalinfo.dlPic,
                    limo_badge_number: $scope.personalinfo.limo_badge_number,
                    ara_exp_Date: $scope.personalinfo.ara_exp_Date,
                    dl_exp_Date: $scope.personalinfo.dl_exp_Date,
                    companyName: $scope.personalinfo.companyName,
                    policyNumber: $scope.personalinfo.policyNumber
                }
            }
            $scope.vehicleinfo = JSON.parse(data)[2];
            if ($scope.vehicleinfo) {
                $scope.vehicle = {
                    make: $scope.vehicleinfo.make,
                    model: $scope.vehicleinfo.model,
                    selectType: $scope.vehicleinfo.selectType,
                    Color: $scope.vehicleinfo.Color,
                    HLL_Number: $scope.vehicleinfo.HLL_Number,
                    licencePlateNum: $scope.vehicleinfo.licencePlateNum,
                    addFeature: $scope.vehicleinfo.addFeature,
                    addFeature2: $scope.vehicleinfo.addFeature2
                }
            };

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
                    confirmPassword: $scope.contact.confirmPassword,
                    primary_phone_number: $scope.contact.primary_phone_number,
                    primary_address: $scope.contact.primary_address,
                    city: $scope.contact.city,
                    state: $scope.contact.state,
                    zipcode: $scope.contact.zipcode
                }
                $scope.personalInfo = {
                    dl_number: $scope.personal.dl_number,
                    dlPic: $scope.personal.dlPic,
                    limo_badge_number: $scope.personal.limo_badge_number,
                    ara_exp_Date: $scope.personal.ara_exp_Date,
                    dl_exp_Date: $scope.personal.dl_exp_Date,
                    companyName: $scope.personal.companyName,
                    policyNumber: $scope.personal.policyNumber
                }
                $scope.vehicleInfo = {
                    make: $scope.vehicle.make,
                    model: $scope.vehicle.model,
                    selectType: $scope.vehicle.selectType,
                    Color: $scope.vehicle.Color,
                    HLL_Number: $scope.vehicle.HLL_Number,
                    licencePlateNum: $scope.vehicle.licencePlateNum,
                    addFeature: $scope.vehicle.addFeature,
                    addFeature2: $scope.vehicle.addFeature2
                }

                localStorage.setItem("driverdata", JSON.stringify([$scope.contactinfo, $scope.personalInfo, $scope.vehicleInfo]));
                var data = localStorage.getItem('driverdata');
                $scope.contactinfo = JSON.parse(data)[0];
                $scope.contact = {
                    fullName: $scope.contactinfo.fullName,
                    lastName: $scope.contactinfo.lastName,
                    email: $scope.contactinfo.email,
                    password: $scope.contactinfo.password,
                    confirmPassword: $scope.contactinfo.confirmPassword,
                    primary_phone_number: $scope.contactinfo.primary_phone_number,
                    primary_address: $scope.contactinfo.primary_address,
                    city: $scope.contactinfo.city,
                    state: $scope.contactinfo.state,
                    zipcode: $scope.contactinfo.zipcode
                }
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
            $scope.Personal_previous = function() {
                $scope.isContact = true;
                $scope.isPersonal = false;
            }
            $scope.Vehicle_Next = function() {
                $scope.isAccount = true;
                $scope.isContact = false;
                $scope.isPersonal = false;
                $scope.isVehicle = false;
            }
            $scope.Vehicle_Previous = function(){
                $scope.isPersonal = true;
                $scope.isVehicle = false;
            }
            $scope.Account_Previous = function(){
                $scope.isVehicle = true;
                $scope.isAccount = false;
            }

        }

    ]);
