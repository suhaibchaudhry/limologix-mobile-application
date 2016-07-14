///////////////////////////////////


'use strict';

/**
 * @ngdoc function
 * @name LimoCordova.controller:MyAccountCtrl
 * @description
 * # MyAccountCtrl
 * Controller of the LimoCordova
 */
app
    .controller('MyAccountCtrl', [
        '$scope',
        '$state',
        '$http',
        'appSettings',
        'notify',
        '$window',
        'services',
        'AppConstants',
        'countriesConstant',
        'StatesConstants',
        'VehicleConstants',
        'ModelConstants',
        'MakeConstants',
        '$q',
        function($scope, $state, $http, appSettings, notify, $window, services, AppConstants, countriesConstant, StatesConstants, VehicleConstants, ModelConstants, MakeConstants,$q) {
            var self = this;
            $scope.phoneNumbr = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            $scope.contact = {};
            $scope.personal = {};
            $scope.vehicle = {};
            $scope.isContact = true;
            $scope.isPersonal = false;
            $scope.isVehicle = false;
            $scope.selected = {};
            $scope.colorsArr = ['Red', 'Black', 'White', 'Other'];
            $scope.vehicle.Color = $scope.colorsArr[0];
            getCountries();

             //Get countries from API
            function getCountries() {
                //Load countries and keep them in constants on app load and get countries from constants
                if (countriesConstant.countries.length) {
                    $scope.countries = countriesConstant.countries;
                    $scope.selected.selectedCountry = $scope.countries[0];
                    getDriverInfo().then(function(address) {
                        $scope.getStates(address);
                    });
                } else {
                    var url = appSettings.serverPath + appSettings.serviceApis.company_getCountries;
                    services.funcGetRequest(url).then(function(response) {
                        $scope.countries = response.data;
                        countriesConstant.countries = $scope.countries;
                        $scope.selected.selectedCountry = $scope.countries[0];
                           getDriverInfo().then(function(address,vehicle) {
                            $scope.getStates(address);
                            });       
                        
                    }, function(error) {
                        notify({ classes: 'alert-danger', message: error.message });
                    });
                }
            }
            //Get selected state from the view
            $scope.getStates = function(address) {
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

             //Get driver details.
            function getDriverInfo() {
                var responseToken = $q.defer();
                var url = appSettings.serverPath + appSettings.serviceApis.getDriverInfo;
                services.funcGetRequest(url).then(function(response,status) {
                    var response = response.data.driver;
                    $scope.contact = {
                        fullName: response.first_name,
                        lastName: response.last_name,
                        email: response.email,
                        primary_phone_number: response.mobile_number,
                        primary_address:response.address.street,
                        city :response.address.city,
                        zipcode: response.address ? response.address.zipcode : ''
                    }
                    $scope.personal = {
                        dl_number:response.license_number,
                        dlImage : appSettings.server_address + response.license_image.image,
                        dlImageName: response.license_image.name,
                        dl_exp_Date:new Date(response.license_expiry_date),
                        limo_badge_number:response.badge_number,
                        limo_badge_exp_Date:new Date(response.badge_expiry_date),
                        araImage: appSettings.server_address + response.ara_image.image,
                        araImageName:response.ara_image.name,
                        ara_exp_Date:new Date(response.ara_expiry_date),
                        insurance_exp_Date:new Date(response.insurance_expiry_date),
                        companyName:response.insurance_company,
                        policyNumber:response.insurance_policy_number
                    }
                    toDataUrl($scope.personal.dlImage,false, function(base64_dlImg) {
                      $scope.personal.dlImage = base64_dlImg;
                    });
                    toDataUrl($scope.personal.araImage,false, function(base64_araImg) {
                      $scope.personal.araImage = base64_araImg;
                    });
                    $scope.vehicle = {
                        Color :response.vehicle.color,
                        HLL_Number :response.vehicle.hll_number,
                        licencePlateNum:response.vehicle.license_plate_number,
                        addFeature1: response.vehicle.features[0] ? response.vehicle.features[0] : '',
                        addFeature2: response.vehicle.features[1] ? response.vehicle.features[1] : '',
                        addFeature3: response.vehicle.features[2] ? response.vehicle.features[2] : '',
                        addFeature4: response.vehicle.features[3] ? response.vehicle.features[3] : '',
                        addFeature5: response.vehicle.features[4] ? response.vehicle.features[4] : '',
                        addFeature6: response.vehicle.features[5] ? response.vehicle.features[5] : ''
                    }
                    jQuery.grep($scope.countries, function(e, i){
                         if(response.address && response.address.country && e.code == response.address.country.code)
                                $scope.selected.selectedCountry =  e;
                    })                    
                    
                    responseToken.resolve(response.address);
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error.message });
                    responseToken.reject(error);
                });
                return responseToken.promise;
            }

            //Convert image to base64 and send a request - For preview image.
            function toDataUrl(url,bool, callback) {
                if(bool){
                   callback(url);
                    return;    
                }
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = function() {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        callback(reader.result);
                    }
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', url);
                xhr.send();
            }

            function getDriverVehicleInfo() {
                var responseToken = $q.defer();
                var url = appSettings.serverPath + appSettings.serviceApis.getDriverInfo;
                services.funcGetRequest(url).then(function(response,status) {
                    var response = response.data.driver;
                    
                    jQuery.grep($scope.vehicleTypes, function(e, i){
                         if(response.vehicle && response.vehicle.vehicle_type && e.id == response.vehicle.vehicle_type.id)
                                $scope.selected.selectedVehicleType =  e;
                    })
                    
                    responseToken.resolve(response.vehicle);
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error.message });
                    responseToken.reject(error);
                });
                return responseToken.promise;
            }            

            getVehicleTypes();
            //Get vehicle types
            function getVehicleTypes() {
                if (VehicleConstants.vehicleTypes.length) {
                    $scope.vehicleTypes = VehicleConstants.vehicleTypes;
                    $scope.selected.selectedVehicleType = $scope.vehicleTypes[0];
                    getDriverVehicleInfo().then(function(vehicle) {
                        $scope.getMakes(vehicle);
                    });
                } else {
                    var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getVehicleTypes;
                    services.funcGetRequest(url).then(function(response) {
                        $scope.vehicleTypes = response.data.vehicle_types;
                        VehicleConstants.vehicleTypes = $scope.vehicleTypes;
                        $scope.selected.selectedVehicleType = $scope.vehicleTypes[0];
                           getDriverVehicleInfo().then(function(vehicle) {
                            $scope.getMakes(vehicle);
                           });  
                        
                    }, function(error) {
                        notify({ classes: 'alert-danger', message: error.message });
                    });
                }
            }
            //Get selected make from the view
            $scope.getMakes = function(vehicle) {
                var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getMakes;
                services.funcPostRequest(url, { 'vehicle_type_id': $scope.selected.selectedVehicleType.id }).then(function(response) {
                    $scope.makes = response.data.vehicle_makes;
                    if(vehicle && vehicle.vehicle_make){
                        jQuery.grep($scope.makes, function(e, i){
                           if(e.id == vehicle.vehicle_make.id)
                               $scope.selected.selectedMake =  e;

                        })
                       
                    }else{
                       $scope.selected.selectedMake = $scope.makes[0];
                    }
                     $scope.getModels(vehicle);
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            };

            //Get selected make from the view
            $scope.getModels = function(vehicle) {
                var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getModels;
                services.funcPostRequest(url,{'vehicle_type_id': $scope.selected.selectedVehicleType.id, 'vehicle_make_id': $scope.selected.selectedMake.id }).then(function(response) {
                    $scope.models = response.data.vehicle_models;
                    if(vehicle && vehicle.vehicle_make && vehicle.vehicle_model){
                        jQuery.grep($scope.models, function(e, i){
                           if(e.id == vehicle.vehicle_model.id)
                               $scope.selected.selectedModel =  e;
                        })
                    }else
                       $scope.selected.selectedModel = $scope.models[0];
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            };
            
            //File uploads for Licence plate and ARA photos.
            $scope.DriverLicenceUpload = function() {
                $("input[id='dlPicFileUpload']").click();
            }
            $scope.ARAUpload = function() {
                $("input[id='araPicFileUpload']").click();
            }
            $("#dlPicFileUpload").change(function() {
                readURL(this, "dl");
            });
            $("#araPicFileUpload").change(function() {
                readURL(this, "ara");
            });

            function readURL(input, str) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        if (str === "dl") {
                            $('#dlImg').attr('src', e.target.result);
                            $scope.personal.dlImage = e.target.result;
                            $scope.personal.dlImage_name = input.files[0].name;
                            localStorage.setItem("dlImageName", $scope.personal.dlImage_name)
                        } else {
                            $('#araImg').attr('src', e.target.result);
                            $scope.personal.araImage = e.target.result;
                            $scope.personal.araImage_name = input.files[0].name;
                            localStorage.setItem("araImageName", $scope.personal.araImage_name)
                        }
                        //console.log('dsds', e.target, input.files[0])
                    }
                    reader.readAsDataURL(input.files[0]);
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

            $scope.update_contactInfo = function() {
                $scope.contactDetails = {
                        first_name: $scope.contact.fullName,
                        last_name: $scope.contact.lastName,
                        email: $scope.contact.email,
                        mobile_number: $scope.contact.primary_phone_number,
                        address:{
                            street: $scope.contact.primary_address,
                            city: $scope.contact.city,
                            zipcode : $scope.contact.zipcode,
                            state_code: $scope.selected.selectedState.code,
                            country_code: $scope.selected.selectedCountry.code,
                        }
                    }
                 var url = appSettings.serverPath + appSettings.serviceApis.update_contact_info;
                services.funcPostRequest(url, {"driver":$scope.contactDetails}).then(function(response) {
                    console.log(response);
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                    $state.go('core.profile.my_account');
                }); 
            }
            $scope.update_personalInfo = function() {
                $scope.personalDetails = {
                        license_number: $scope.personal.dl_number,
                        license_image:{
                            image: $scope.personal.dlImage,
                            name: $scope.personal.dlImageName,
                        },                       
                        license_expiry_date: new Date($scope.personal.dl_exp_Date),
                        badge_expiry_date: new Date($scope.personal.limo_badge_exp_Date),
                        badge_number: $scope.personal.limo_badge_number,
                        ara_image:{
                             image: $scope.personal.araImage,
                             name: $scope.personal.araImageName,
                        },                      
                        ara_expiry_date: new Date($scope.personal.ara_exp_Date),
                        insurance_expiry_date: new Date($scope.personal.insurance_exp_Date),
                        insurance_company: $scope.personal.companyName,
                        insurance_policy_number: $scope.personal.policyNumber
                }
                var url = appSettings.serverPath + appSettings.serviceApis.update_personal_info;
                services.funcPostRequest(url, {"driver":$scope.personalDetails}).then(function(response) {
                    console.log(response);
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                    $state.go('core.profile.my_account');
                });
            }
             $scope.update_vehicleInfo = function() {
                 $scope.featuresArr = [];
                    $scope.featuresArr.push($scope.vehicle.addFeature1);
                    $scope.featuresArr.push($scope.vehicle.addFeature2);
                    $scope.featuresArr.push($scope.vehicle.addFeature3);
                    $scope.featuresArr.push($scope.vehicle.addFeature4);
                    $scope.featuresArr.push($scope.vehicle.addFeature5);
                    $scope.featuresArr.push($scope.vehicle.addFeature6);

                    $scope.featuresArr = $scope.featuresArr.filter(function(element) {
                        return !!element;
                    });

                    $scope.vehicleDetails = {
                        vehicle_make_id: $scope.selected.selectedMake.id,
                        vehicle_model_id: $scope.selected.selectedModel.id,
                        vehicle_type_id: $scope.selected.selectedVehicleType.id,
                        color: $scope.vehicle.Color,
                        hll_number: $scope.vehicle.HLL_Number,
                        license_plate_number: $scope.vehicle.licencePlateNum,
                        Features: $scope.featuresArr
                    }
                var url = appSettings.serverPath + appSettings.serviceApis.update_vehicle_info;
                services.funcPostRequest(url, {"vehicle":$scope.vehicleDetails}).then(function(response) {
                    console.log(response);
                    notify({ classes: 'alert-success', message: response.message });
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                    $state.go('core.profile.my_account');
                });
            }
            
            $scope.Vehicle_Previous = function() {
                $scope.isPersonal = true;
                $scope.isVehicle = false;
            }
                //Submit the form
            $scope.DriverSignup = function() {
                var data = localStorage.getItem('driverdata');
                $scope.contactinfo = JSON.parse(data)[0];

                $scope.personalinfo = JSON.parse(data)[1];
                //Get uploaded image names from localStorage
                var dlImageName = localStorage.getItem("dlImageName");
                $scope.personalinfo.dlImage_name = dlImageName;
                var araImageName = localStorage.getItem("araImageName");
                $scope.personalinfo.araImage_name = araImageName;

                $scope.vehicleinfo = JSON.parse(data)[2];
                $scope.driverDetails = {
                    "driver": {
                        first_name: $scope.contactinfo.fullName,
                        last_name: $scope.contactinfo.lastName,
                        password: $scope.contactinfo.password,
                        mobile_number: $scope.contactinfo.primary_phone_number,
                        email: $scope.contactinfo.email,
                        address: {
                            street: $scope.contactinfo.primary_address,
                            city: $scope.contactinfo.city,
                            zipcode: $scope.contactinfo.zipcode,
                            state_code: $scope.contactinfo.state_code.code,
                            country_code: $scope.contactinfo.country_code.code
                        },
                        license_number: $scope.personalinfo.dl_number,
                        license_expiry_date: $scope.personalinfo.dl_exp_Date,
                        license_image: {
                            name: $scope.personalinfo.dlImage_name,
                            image: $scope.personalinfo.dlPic
                        },
                        badge_number: $scope.personalinfo.limo_badge_number,
                        badge_expiry_date: $scope.personalinfo.limo_badge_exp_Date,
                        //ara_number: $scope.personalinfo.ar,
                        ara_expiry_date: $scope.personalinfo.ara_exp_Date,
                        ara_image: {
                            name: $scope.personalinfo.araImage_name,
                            image: $scope.personalinfo.araPic
                        },
                        insurance_company: $scope.personalinfo.companyName,
                        insurance_policy_number: $scope.personalinfo.policyNumber,
                        insurance_expiry_date: $scope.personalinfo.insurance_exp_Date
                    },
                    "vehicle": {
                        vehicle_make_id: $scope.vehicleinfo.make.id, //$scope.vehicleinfo.make,
                        vehicle_model_id: $scope.vehicleinfo.model.id, //$scope.vehicleinfo.model,
                        hll_number: $scope.vehicleinfo.HLL_Number,
                        color: $scope.vehicleinfo.Color,
                        license_plate_number: $scope.vehicleinfo.licencePlateNum,
                        vehicle_type_id: $scope.vehicleinfo.selectType.id,
                        features: $scope.vehicleinfo.Features
                    }
                };
                var url = appSettings.serverPath + appSettings.serviceApis.registration;
                services.funcPostRequest(url, $scope.driverDetails).then(function(response) {
                    console.log($scope.driverDetails);
                    console.log(response);
                    $http.defaults.headers.common['Auth-Token'] = response.data['Auth-Token'];
                    $window.sessionStorage['Auth-Token'] = response.data['Auth-Token'];
                    AppConstants.driver = response.data;
                    AppConstants.driver.name = response.data.full_name;
                    $window.sessionStorage['driver'] = JSON.stringify(AppConstants.driver);
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('core.appSettings');
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                    $state.go('core.signup');
                });
            }
        }
    ])

.controller('DatepickerTripCtrl', ['$scope', function($scope) {
    $scope.today = function() {
        //update exp dates
        if ($scope.personal) {
            $scope.personal.dl_exp_Date = $scope.personal.dl_exp_Date ? new Date($scope.personal.dl_exp_Date) : new Date();
            $scope.personal.limo_badge_exp_Date = $scope.personal.limo_badge_exp_Date ? new Date($scope.personal.limo_badge_exp_Date) : new Date();
            $scope.personal.ara_exp_Date = $scope.personal.ara_exp_Date ? new Date($scope.personal.ara_exp_Date) : new Date();
            $scope.personal.insurance_exp_Date = $scope.personal.insurance_exp_Date ? new Date($scope.personal.insurance_exp_Date) : new Date();
        }
    };

    $scope.today();

    $scope.clear = function() {
        $scope.tripinfo.pickup_date = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        'class': 'datepicker'
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
}])
