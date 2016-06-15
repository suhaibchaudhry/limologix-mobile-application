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
        'countriesConstant',
        'StatesConstants',
        function($scope, $state, $http, appSettings, notify, $window, services, countriesConstant, StatesConstants) {
            var self = this;
            self.defaultDropdownStrings = [
                'China',
                'Sweden',
                'United Kingdom',
                'United States'
            ];
            $scope.phoneNumbr = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            //$scope.options = ['Houston'];
            $scope.vehicleTypesArr = [];
            $scope.statesArr = [];
            $scope.contact = {};
            $scope.personal = {};
            $scope.vehicle = {};
            $scope.isContact = true;
            $scope.isPersonal = false;
            $scope.isVehicle = false;
            $scope.selected = {};

            getVehicleTypes();
            $scope.vehicle.selectType = $scope.vehicleTypesArr[0];
            $scope.vehicle.model = $scope.vehicleTypesArr[0];
            $scope.vehicle.make = $scope.vehicleTypesArr[0];

            
             getCountries();
            //Get countries from API
            function getCountries() {
                //Load countries and keep them in constants on app load and get countries from constants
                if (countriesConstant.countries.length) {
                    $scope.countries = countriesConstant.countries;
                    $scope.selected.selectedCountry = $scope.countries[0];
                        $scope.GetSelectedCountry(address);
                } else {
                    var url = appSettings.serverPath + appSettings.serviceApis.company_getCountries;
                    services.funcGetRequest(url).then(function(response) {
                        $scope.countries = response.data;
                        countriesConstant.countries = $scope.countries;
                        $scope.selected.selectedCountry = $scope.countries[0];
                                  var address ={
                                    "country": {
                                        "code": "US",
                                        "name": "United States"
                                    },
                                    "state": {
                                        "code": "AK",
                                        "name": "Alaska"
                                    }
                                }
                            $scope.GetSelectedCountry(address);
                        
                    }, function(error) {
                        notify({ classes: 'alert-danger', message: error.message ? error.message : '' });
                    });
                }
            }
            //Get selected state from the view
            $scope.GetSelectedCountry = function(address) {
                var url = appSettings.serverPath + appSettings.serviceApis.company_getStates;
                services.funcPostRequest(url, { 'country_code': $scope.selected.selectedCountry.code }).then(function(response) {
                    $scope.states = response.data;
                    if(address && address.state){
                        jQuery.grep($scope.states, function(e, i){
                           if(e.code == address.state.code)
                               $scope.selected.selectedState =  e;
                        })
                    }else
                       $scope.selected.selectedState = $scope.states[0];
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            };


            var data = localStorage.getItem('driverdata');
            if (data)
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
                        zipcode: $scope.contactinfo.zipcode
                  }
                  $scope.selected.selectedCountry = $scope.contactinfo.country_code;
                  $scope.selected.selectedState = $scope.contactinfo.state_code;

                
                    
            }
            if (data)
                $scope.personalinfo = JSON.parse(data)[1];
            if ($scope.personalinfo) {
                $scope.personal = {
                    dl_number: $scope.personalinfo.dl_number,
                    dlImage: $scope.personalinfo.dlPic,
                    //dlImage_name :$scope.personalinfo.dlImage_name,
                    dl_exp_Date: $scope.personalinfo.dl_exp_Date,
                    limo_badge_exp_Date: $scope.personalinfo.limo_badge_exp_date,
                    limo_badge_number: $scope.personalinfo.limo_badge_number,
                    araImage: $scope.personalinfo.araPic,
                    //araImage_name :$scope.personalinfo.araImage_name,
                    ara_exp_Date: $scope.personalinfo.ara_exp_Date,                   
                    insurance_exp_Date:$scope.personalinfo.insurance_expiry_date,
                    companyName: $scope.personalinfo.companyName,
                    policyNumber: $scope.personalinfo.policyNumber
                }
            }
//             if (data)
//                 $scope.vehicleinfo = JSON.parse(data)[2];
//             if ($scope.vehicleinfo) {
//                 $scope.vehicle = {
//                     make: $scope.vehicleinfo.make,
//                     model: $scope.vehicleinfo.model,
//                     selectType: $scope.vehicleinfo.selectType,
//                     Color: $scope.vehicleinfo.Color,
//                     HLL_Number: $scope.vehicleinfo.HLL_Number,
//                     licencePlateNum: $scope.vehicleinfo.licencePlateNum,
//                     addFeature: $scope.vehicleinfo.addFeature,
//                     addFeature2: $scope.vehicleinfo.addFeature2
//                 }
//             };

            function getStates() {
                if (StatesConstants.states.length) {
                    $scope.states = StatesConstants.states;
                    $scope.selected.selectedState = $scope.states[0];
                } else {
                    var url = appSettings.serverPath + appSettings.serviceApis.driver_getStates;
                    services.funcPostRequest(url, { 'country_code': 'US' }).then(function(response) {
                        console.log(response);
                        $scope.states = response.data;
                        StatesConstants.states = $scope.states;
                        var data = JSON.parse(localStorage.getItem('driverdata'))[0].state;
                        if (data) {
                            $scope.selected.selectedState = data;
                        } else
                            $scope.selected.selectedState = $scope.states[0];
                        // for (var j = 0; j < $scope.states .length; j++) {
                        //     $scope.statesArr.push($scope.states [j].name)
                        // }
                        // $scope.contact.state = $scope.statesArr[0];

                    });
                }
            }

            function getVehicleTypes() {
                //     //Load countries and keep them in constants on app load and get countries from constants

                var url = appSettings.serverPath + appSettings.serviceApis.selectVehicleType;
                //services.funcGetRequest(url).then(function(response) {
                $scope.vehicleTypes = {
                    "status": "success",
                    "message": "Vehicle types list.",
                    "data": {
                        "vehicle_types": [{
                            "id": 1,
                            "name": "suv",
                            "description": "Hic odit distinctio cum sequi dolores tempore.",
                            "capacity": 9,
                            "image": "/uploads/vehicle_type/image/1/dummy_image_9.png"
                        }, {
                            "id": 2,
                            "name": "van",
                            "description": "Optio sed et veniam eum.",
                            "capacity": 7,
                            "image": "/uploads/vehicle_type/image/2/dummy_image_7.png"
                        }]
                    }
                };

                var ss = $scope.vehicleTypes.data.vehicle_types;
                for (var i = 0; i < ss.length; i++) {
                    $scope.vehicleTypesArr.push(ss[i].name);
                }
                console.log($scope.vehicleTypesArr);
                //response.data;
                //             //countriesConstant.countries = $scope.countries;
                //             //$scope.selected.selectedCountry = $scope.countries[0];
                //            // if(countriesConstant.user['Auth-Token']){
                //                // getCompanyInfo().then(function(address) {
                //                //  $scope.GetSelectedCountry(address);
                //                 });         
                //           //  }

                //         }, function(error) {
                //             notify({ classes: 'alert-danger', message: error.message });
                //         });
                // });
            }
            //File uploads for Licence plate and ARA photos.
            $scope.DriverLicenceUpload = function() {
                $("input[id='dlPic']").click();
            }
            $scope.ARAUpload = function() {
                $("input[id='araPic']").click();
            }

            function readURL(input, str) {

                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        if (str === "dl"){
                            $('#dlImg').attr('src', e.target.result);
                            $scope.personal.dlImage = e.target.result;
                            $scope.personal.dlImage_name = input.files[0].name;
                        }else
                        {
                            $('#araImg').attr('src', e.target.result);
                             $scope.personal.araImage = e.target.result;
                             $scope.personal.araImage_name = input.files[0].name;
                        }
                        console.log('dsds', e.target, input.files[0])
                    }

                    reader.readAsDataURL(input.files[0]);
                }
            }

            $("#dlPic").change(function() {
                readURL(this, "dl");
            });
            $("#araPic").change(function() {
                readURL(this, "ara");
            });

            $scope.save_contactInfo = function() {
                $scope.contactinfo = {
                    fullName: $scope.contact.fullName,
                    lastName: $scope.contact.lastName,
                    email: $scope.contact.email,
                    password: $scope.contact.password,
                    //confirmPassword: $scope.contact.confirmPassword,
                    primary_phone_number: $scope.contact.primary_phone_number,
                    primary_address: $scope.contact.primary_address,
                    city: $scope.contact.city,
                    state_code: $scope.selected.selectedState.code,
                    country_code: $scope.selected.selectedCountry.code,
                    zipcode: $scope.contact.zipcode
                }
                $scope.personalInfo = {
                    dl_number: $scope.personal.dl_number,
                    dlPic: $scope.personal.dlImage,
                    dlImage_name :$scope.personal.dlImage_name,
                    dl_exp_Date: $scope.personal.dl_exp_Date,
                    limo_badge_exp_date: $scope.personal.limo_badge_exp_Date,
                    limo_badge_number: $scope.personal.limo_badge_number,
                    araPic: $scope.personal.araImage,
                    araImage_name :$scope.personal.araImage_name,
                    ara_exp_Date: $scope.personal.ara_exp_Date,                   
                    insurance_expiry_date:$scope.personal.insurance_exp_Date,
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
                    primary_phone_number: $scope.contactinfo.primary_phone_number,
                    primary_address: $scope.contactinfo.primary_address,
                    city: $scope.contactinfo.city,
                    zipcode: $scope.contactinfo.zipcode
                }
                $scope.selected.selectedState = $scope.contactinfo.state_code;
                $scope.selected.selectedCountry = $scope.contactinfo.country_code;
                //Update personal info from localstorage
                 $scope.personalinfo = JSON.parse(data)[1];
                $scope.personal = {
                    dl_number: $scope.personalinfo.dl_number,
                    dlPic: $scope.personalinfo.dlPic,
                    dl_exp_Date: $scope.personalinfo.dl_exp_Date,
                    limo_badge_exp_date: $scope.personalinfo.limo_badge_exp_date,
                    limo_badge_number: $scope.personalinfo.limo_badge_number,
                    araPic: $scope.personalinfo.araPic,
                    ara_exp_Date: $scope.personalinfo.ara_exp_Date,                   
                    insurance_expiry_date:$scope.personalinfo.insurance_expiry_date,
                    companyName: $scope.personalinfo.companyName,
                    policyNumber: $scope.personalinfo.policyNumber
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
            $scope.DriverSignup = function() {
                     var data = localStorage.getItem('driverdata');
                        $scope.contactinfo = JSON.parse(data)[0];
                        $scope.personalinfo = JSON.parse(data)[1];
                  $scope.driverDetails = {
                          "driver":{
                          first_name: $scope.contactinfo.fullName,
                          last_name : $scope.contactinfo.lastName,
                          password: $scope.contactinfo.password,
                          mobile_number:$scope.contactinfo.primary_phone_number,
                          email:$scope.contactinfo.email,
                          address:{
                                  street:$scope.contactinfo.primary_address,
                                  city:$scope.contactinfo.city,
                                  zipcode:$scope.contactinfo.zipcode,
                                  state_code: $scope.contactinfo.state_code,
                                  country_code:$scope.contactinfo.country_code
                          },
                           license_number:  $scope.personalinfo.dl_number,
                         license_expiry_date: $scope.personalinfo.dl_exp_Date,
                        license_image: {
                            name: $scope.personalinfo.dlImage_name,
                            image: $scope.personalinfo.dlPic
                        },
                        badge_number: $scope.personal.limo_badge_number,
                        badge_expiry_date:$scope.personal.limo_badge_exp_date,
                        //ara_number: $scope.personal.ar,
                        ara_expiry_date: $scope.personal.ara_exp_Date,
                        ara_image: {
                            name: $scope.personal.araImage_name,
                            image: $scope.personal.araPic
                        },
                        insurance_company: $scope.personal.companyName,
                        insurance_policy_number: $scope.personal.policyNumber,
                        insurance_expiry_date: $scope.personal.insurance_expiry_date
                          },
                          "vehicle": {
                                make: dsd,
                                model: dsddssdd,
                                hll_number: 2313,
                                color: black,
                                license_plate_number: 324234,
                                vehicle_type_id: 3,
                                features: ["feature1", "feature2"]
	                       }
                  };

            }
            $scope.Vehicle_Previous = function() {
                $scope.isPersonal = true;
                $scope.isVehicle = false;
            }

        }

    ]);
