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
        'VehicleConstants',
        'ModelConstants',
        'MakeConstants',
        function($scope, $state, $http, appSettings, notify, $window, services, countriesConstant, StatesConstants,VehicleConstants,ModelConstants,MakeConstants) {
            var self = this;
            $scope.phoneNumbr = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            $scope.contact = {};
            $scope.personal = {};
            $scope.vehicle = {};
            $scope.isContact = false;
            $scope.isPersonal = true;
            $scope.isVehicle = false;
            $scope.selected = {};
            $scope.colorsArr = ['Red', 'Black', 'White', 'Other'];
            $scope.vehicle.Color = $scope.colorsArr[0];
            
            //Update countries and states
            $scope.$watch('countries', function() {
                localStorage.setItem('countries', JSON.stringify($scope.countries))
            })
            $scope.$watch('states', function() {
                localStorage.setItem('states', JSON.stringify($scope.states))
            })
            $scope.$watch('vehicleTypes', function() {
                localStorage.setItem('vehicleTypes', JSON.stringify($scope.vehicleTypes))
            })
            $scope.$watch('makes', function() {
                localStorage.setItem('makes', JSON.stringify($scope.makes))
            })
            $scope.$watch('models', function() {
                localStorage.setItem('models', JSON.stringify($scope.models))
            })

            getCountries();

            function funcGetIndex(arr, selected) {
                var arrIndex = jQuery.map(arr, function(e, i) {
                    if (e.code == selected.code) return i;
                })
                return arrIndex.length ? arrIndex[0] : 0;
            }

            //Get countries from API
            function getCountries() {
                //get countries from localStorage
                if(localStorage.getItem('driverdata'))
                {
                    var data = localStorage.getItem('driverdata') || [];
                    data = JSON.parse(data)
                    if (data.length) {
                        var locCountries = localStorage.getItem('countries') === 'undefined' ? '[]' : localStorage.getItem('countries')
                        var countries = JSON.parse(locCountries);
                        var locStates = localStorage.getItem('states') === 'undefined' ? '[]' : localStorage.getItem('states')
                        var states = JSON.parse(locStates);
                    }
                    if (data.length && countries.length && states.length) {
                        $scope.contactinfo = data[0];
                        $scope.contact = {
                            fullName: $scope.contactinfo.fullName,
                            lastName: $scope.contactinfo.lastName,
                            email: $scope.contactinfo.email,
                            password: $scope.contactinfo.password,
                            confirmPassword: $scope.contactinfo.confirmPassword,
                            primary_phone_number: $scope.contactinfo.primary_phone_number,
                            primary_address: $scope.contactinfo.primary_address,
                            city: $scope.contactinfo.city,
                            zipcode: $scope.contactinfo.zipcode
                        }
                        $scope.countries = countries;
                        $scope.states = states;
                        $scope.selected.selectedCountry = $scope.countries[funcGetIndex($scope.countries, $scope.contactinfo.country_code)];
                        $scope.selected.selectedState = $scope.states[funcGetIndex($scope.states, $scope.contactinfo.state_code)];
                        try {
                            $scope.$digest();
                        } catch (e) {

                        }
                     }
                } 
                //Get countries from the server api when app loads for the first time.
                else {
                    var url = appSettings.serverPath + appSettings.serviceApis.company_getCountries;
                    services.funcGetRequest(url).then(function(response) {
                        $scope.countries = response.data;
                        countriesConstant.countries = $scope.countries;
                        $scope.selected.selectedCountry = $scope.countries[0];
                        var address = {
                            "country": {
                                "code": "US",
                                "name": "United States"
                            },
                            "state": {
                                "code": "AK",
                                "name": "Alaska"
                            }
                        }
                        $scope.getStates(address);

                    }, function(error) {
                        notify({ classes: 'alert-danger', message: error.message ? error.message : '' });
                    });
                }
            }
            //Get selected state from the view
            $scope.getStates = function(address) {
                var url = appSettings.serverPath + appSettings.serviceApis.company_getStates;
                services.funcPostRequest(url, { 'country_code': $scope.selected.selectedCountry.code }).then(function(response) {
                    $scope.states = response.data;
                    if (address && address.state) {
                        jQuery.grep($scope.states, function(e, i) {
                            if (e.code == address.state.code)
                                $scope.selected.selectedState = e;
                        })
                    } else
                        $scope.selected.selectedState = $scope.states[0];
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            };
            
            getVehicleType();
            //Get vehicles type from API
            function getVehicleType() {
                //get vehicle info from localStorage on refresh after user has saved his data
                if(localStorage.getItem('driverdata') && localStorage.getItem('vehicleTypes') != 'undefined')
                {
                    var data = localStorage.getItem('driverdata') || [];
                    data = JSON.parse(data)
                    if (data.length) {
                        var locVehicleTypes = localStorage.getItem('vehicleTypes') === 'undefined' ? '[]' : localStorage.getItem('vehicleTypes')
                        var vehicleTypes = JSON.parse(locVehicleTypes);
                        var locMakes = localStorage.getItem('makes') === 'undefined' ? '[]' : localStorage.getItem('makes')
                        var makes = JSON.parse(locMakes);
                        var locModels = localStorage.getItem('models') === 'undefined' ? '[]' : localStorage.getItem('models')
                        var models = JSON.parse(locModels);
                    }

                    if (data.length && vehicleTypes.length && makes.length && models.length) {
                        $scope.vehicleinfo = data[2];
                        $scope.vehicle = {
                            Color: $scope.vehicleinfo.Color,
                            HLL_Number: $scope.vehicleinfo.HLL_Number,
                            licencePlateNum: $scope.vehicleinfo.licencePlateNum,
                            addFeature1: $scope.vehicleinfo.Features[0] ? $scope.vehicleinfo.Features[0] : '',
                            addFeature2: $scope.vehicleinfo.Features[1] ? $scope.vehicleinfo.Features[1] : '',
                            addFeature3: $scope.vehicleinfo.Features[2] ? $scope.vehicleinfo.Features[2] : '',
                            addFeature4: $scope.vehicleinfo.Features[3] ? $scope.vehicleinfo.Features[3] : '',
                            addFeature5: $scope.vehicleinfo.Features[4] ? $scope.vehicleinfo.Features[4] : '',
                            addFeature6: $scope.vehicleinfo.Features[5] ? $scope.vehicleinfo.Features[5] : ''
                        }
                        $scope.vehicleTypes = vehicleTypes;
                        $scope.makes = makes;
                        $scope.models = models;
                        $scope.selected.selectedVehicleType = $scope.vehicleTypes[funcGetIndex($scope.vehicleTypes, $scope.vehicleinfo.id)];
                        $scope.selected.selectedMake = $scope.makes[funcGetIndex($scope.makes, $scope.vehicleinfo.id)];
                        $scope.selected.selectedModel = $scope.models[funcGetIndex($scope.models, $scope.vehicleinfo.id)];
                        try {
                            $scope.$digest();
                        } catch (e) {

                        }
                     }

                } 
                else{               
                   //Get countries from the server api when app loads for the first time.
                    var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getVehicleTypes;
                    services.funcGetRequest(url).then(function(response) {
                        $scope.vehicleTypes = response.data.vehicle_types;
                        VehicleConstants.vehicleTypes = $scope.vehicleTypes;
                        $scope.selected.selectedVehicleType = $scope.vehicleTypes[0];
                        var info = {
                            "vehicle": {
                                "id": "1",
                                "name": "SUV"
                            },
                            "make": {
                                "id": "1",
                                "name": "Lincoln"
                            },
                            "model":{
                                "id":"1",
                                "name":"MKT"
                            }
                        }
                        $scope.getMakes(info);

                    }, function(error) {
                        notify({ classes: 'alert-danger', message: error.message ? error.message : '' });
                    });
                }
            }
            //Get selected make based on vehicle type selection
            $scope.getMakes = function(info) {
                var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getMakes;
                services.funcPostRequest(url, { 'vehicle_type_id': $scope.selected.selectedVehicleType.id }).then(function(response) {
                    $scope.makes = response.data.vehicle_makes;
                    if (info && info.make) {
                        jQuery.grep($scope.makes, function(e, i) {
                            if (e.id == info.make.id)
                            {
                                $scope.selected.selectedMake = e;
                            }else{
                                $scope.getModels(info);
                            }
                        })
                    } else{
                         $scope.selected.selectedMake = $scope.makes[0];
                    }

                    $scope.getModels(info);
                       
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
               
            };

            //Get selected model based on vehicle type and make selection
            $scope.getModels = function(info) {
                var url = appSettings.serverPath  + appSettings.serviceApis.vehicle_getModels;
                services.funcPostRequest(url, { 'vehicle_type_id': $scope.selected.selectedVehicleType.id, 'vehicle_make_id': $scope.selected.selectedMake.id }).then(function(response) {
                    $scope.models = response.data.vehicle_models;
                    if (info && info.model) {
                        jQuery.grep($scope.models, function(e, i) {
                            if (e.id == info.model.id){
                                $scope.selected.selectedModel = e;
                            }else{
                                 $scope.selected.selectedModel = $scope.models[0];
                            } 
                        })
                    } else
                        $scope.selected.selectedModel = $scope.models[0];
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            };





            //Update form models form local storage on Page refresh

            var data = localStorage.getItem('driverdata');
            //Personal Information
            if (data)
                $scope.personalinfo = JSON.parse(data)[1];
            if ($scope.personalinfo) {
                $scope.personal = {
                    dl_number: $scope.personalinfo.dl_number,
                    dlImage: $scope.personalinfo.dlPic,
                    //dlImage_name :$scope.personalinfo.dlImage_name,
                    dl_exp_Date: new Date($scope.personalinfo.dl_exp_Date),
                    limo_badge_exp_Date: new Date($scope.personalinfo.limo_badge_exp_Date),
                    limo_badge_number: $scope.personalinfo.limo_badge_number,
                    araImage: $scope.personalinfo.araPic,
                    //araImage_name :$scope.personalinfo.araImage_name,
                    ara_exp_Date: new Date($scope.personalinfo.ara_exp_Date),
                    insurance_exp_Date: new Date($scope.personalinfo.insurance_exp_Date),
                    companyName: $scope.personalinfo.companyName,
                    policyNumber: $scope.personalinfo.policyNumber
                }
            }

            //Vehicle Information
            if (data)
                $scope.vehicleinfo = JSON.parse(data)[2];
            if ($scope.vehicleinfo) {
                $scope.vehicle = {
                    make: $scope.vehicleinfo.make,
                    model: $scope.vehicleinfo.model,
                    selectType: $scope.vehicleinfo.selectType,
                    Color: $scope.vehicleinfo.Color,
                    HLL_Number: $scope.vehicleinfo.HLL_Number,
                    licencePlateNum: $scope.vehicleinfo.licencePlateNum,
                    addFeature1: $scope.vehicleinfo.Features[0] ? $scope.vehicleinfo.Features[0] : '',
                    addFeature2: $scope.vehicleinfo.Features[1] ? $scope.vehicleinfo.Features[1] : '',
                    addFeature3: $scope.vehicleinfo.Features[2] ? $scope.vehicleinfo.Features[2] : '',
                    addFeature4: $scope.vehicleinfo.Features[3] ? $scope.vehicleinfo.Features[3] : '',
                    addFeature5: $scope.vehicleinfo.Features[4] ? $scope.vehicleinfo.Features[4] : '',
                    addFeature6: $scope.vehicleinfo.Features[5] ? $scope.vehicleinfo.Features[5] : ''
                }
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
                        console.log('dsds', e.target, input.files[0])
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
                        state_code: $scope.selected.selectedState,
                        country_code: $scope.selected.selectedCountry,
                        zipcode: $scope.contact.zipcode
                    }
                    $scope.personalInfo = {
                        dl_number: $scope.personal.dl_number,
                        dlPic: $scope.personal.dlImage,
                        dlImage_name: $scope.personal.dlImage_name,
                        dl_exp_Date: new Date($scope.personal.dl_exp_Date),
                        limo_badge_exp_Date: new Date($scope.personal.limo_badge_exp_Date),
                        limo_badge_number: $scope.personal.limo_badge_number,
                        araPic: $scope.personal.araImage,
                        araImage_name: $scope.personal.araImage_name,
                        ara_exp_Date: new Date($scope.personal.ara_exp_Date),
                        insurance_exp_Date: new Date($scope.personal.insurance_exp_Date),
                        companyName: $scope.personal.companyName,
                        policyNumber: $scope.personal.policyNumber
                    }

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

                    $scope.vehicleInfo = {
                        make: $scope.selected.selectedMake,
                        model: $scope.selected.selectedModel,
                        selectType: $scope.selected.selectedVehicleType,
                        vehicleId: $scope.vehicle.vehicleId,
                        // selectTypeId:$scope.
                        Color: $scope.vehicle.Color,
                        HLL_Number: $scope.vehicle.HLL_Number,
                        licencePlateNum: $scope.vehicle.licencePlateNum,
                        Features: $scope.featuresArr
                    }
                    localStorage.setItem("driverdata", JSON.stringify([$scope.contactinfo, $scope.personalInfo, $scope.vehicleInfo]));
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
                        vehicle_make_id: $scope.vehicle.makeId,//$scope.vehicleinfo.make,
                        vehicle_model_id: $scope.vehicle.modelId,//$scope.vehicleinfo.model,
                        hll_number: $scope.vehicleinfo.HLL_Number,
                        color: $scope.vehicleinfo.Color,
                        license_plate_number: $scope.vehicleinfo.licencePlateNum,
                        vehicle_type_id: $scope.vehicle.vehicleId,
                        features: $scope.vehicleinfo.Features
                    }
                };
                var url = appSettings.serverPath + appSettings.serviceApis.signin;
                services.funcPostRequest(url, $scope.driverDetails).then(function(response) {
                    console.log($scope.driverDetails);
                    console.log(response);
                    localStorage.setItem("drivername", response.data.full_name)
                    notify({ classes: 'alert-success', message: response.message });
                    $state.go('app.dashboard');
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });
            }
            $scope.Vehicle_Previous = function() {
                $scope.isPersonal = true;
                $scope.isVehicle = false;
            }
        }
    ])

.controller('DatepickerTripCtrl', ['$scope', 'countriesConstant', function($scope, constants) {
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
