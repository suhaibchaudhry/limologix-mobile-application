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
        '$locale',
        '$state',
        '$http',
        '$filter',
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
        function($scope, $locale, $state, $http, $filter, appSettings, notify, $window, services, AppConstants, countriesConstant, StatesConstants, VehicleConstants, ModelConstants, MakeConstants) {
            var self = this;
            $scope.phoneNumbr = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            $scope.contact = {};
            $scope.personal = {};
            $scope.vehicle = {};
            $scope.isContact = true;
            $scope.isPersonal = false;
            $scope.isVehicle = false;
            $scope.isCardDetails = false;
            $scope.isTermsAndConditions = false;
            $scope.backBtn = false;
            $scope.selected = {};
            $scope.colorsArr = ['Red', 'Black', 'White', 'Other'];
            $scope.vehicle.Color = $scope.colorsArr[0];
            $scope.localStorageArr = [];
            $scope.currentYear = new Date().getFullYear()
            $scope.currentMonth = new Date().getMonth() + 1
            $scope.months = $locale.DATETIME_FORMATS.MONTH
            $scope.card = {
                type: undefined
            }
            localStorage.setItem("driverdata",'');
            //  $scope.enableNext = false;

            // $scope.isEnableContactNext = false;
            // $scope.isEnablePersonalNext = false;
            // $scope.isEnableSubmit = false;


            //Watch dropdown feilds - To Update countries and states,vehicleTypes,makes and models after save.
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


            $scope.selectedAll = false;

            $scope.Items = [{
                checked: true,
                label: 'This application is for independent limo drivers to become a member of limologix network.The independent limo driver will be known as a Driver Member("DM")'
            }, {
                checked: true,
                label: "Limo Logix reserves the right to terminate any DM who misuses the Limo Logix network and service"
            }, {
                checked: true,
                label: 'DM has the right to use benifits of the Limo Logix network and website anywhere in the US that Limo Logix provides their service'
            }, {
                checked: true,
                label: 'DM will provide Limo Logix with all up-to-date driver information ,car information or background checks.Limo Logix will periodically check-in to ensure they have the most up-to-date information.'
            }, {
                checked: true,
                label: 'Limo Logix has the right to manage limo Logix website and application.'
            }, {
                checked: true,
                label: 'DM will immediately become a user of the Limo Logix website once the Independent Driver Application is completed'
            }, {
                checked: true,
                label: 'Limo Logix will not collect any charges for the DM from limo companies and all charge for trip will be between the limo companies and DM. Limo Logix is not responsible for any fraud or dispute between the limo company and the DM.'
            }, {
                checked: true,
                label: 'When a DM needs assistance with a dispute with the limo company, they should contact Local Limo Association,the City or National Limo Association on their own.'
            }, {
                checked: true,
                label: 'DMs are all equal and have the right to get all benifits of the limo logix network and website equally.'
            }, {
                checked: true,
                label: 'Upon inputting your credit card information,you authorize Limo Logix to charge you $22.00,of which $20.00 will be credited to your Limo Logix Account. Of the $22.00 you are charged on a recurring basis, $2 are for taxes and admin fees which will not be credited to your Limo Logix account for a trip. Each trip you accept, $2.00 will be subtracted from the Limo Logix Credit and upon accepting 8 trips and you have $4.00 left in your account, the card you have on file will be charged $22.00.This will be on recurring basis,each time the Limo Logix Credit is at $4.00, your card will be automatically charged $22.00'
            }
            ];

                  $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.Items, function (item) {
            item.Selected = $scope.selectedAll;
        });

    };
        
        $scope.notifyMaster = function () {
            $scope.selectedAll = !$scope.Items.some(function (item) {
               return !item.Selected;  //check if ANY are unchecked
            });
        }


            getCountries();

            //Get countries from API
            function getCountries() {
                // get countries from localStorage
                if (localStorage.getItem('driverdata')) {
                    var data = localStorage.getItem('driverdata') || [];
                    data = JSON.parse(data);
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
                            company_name: $scope.contactinfo.company,
                            password: $scope.contactinfo.password,
                            confirmPassword: $scope.contactinfo.confirmPassword,
                            primary_phone_number: $scope.contactinfo.primary_phone_number,
                            primary_address: $scope.contactinfo.primary_address,
                            secondary_address: $scope.contactinfo.secondary_address,
                            city: $scope.contactinfo.city,
                            zipcode: $scope.contactinfo.zipcode
                        }
                        $scope.countries = countries;
                        $scope.states = states;
                        if ($scope.contactinfo.country_code) {
                            $scope.selected.selectedCountry = $scope.countries[funcGetIndex($scope.countries, $scope.contactinfo.country_code)];
                        }
                        if ($scope.contactinfo.state_code)
                            $scope.selected.selectedState = $scope.states[funcGetIndex($scope.states, $scope.contactinfo.state_code)];
                        try {
                            $scope.$digest();
                        } catch (e) {

                        }
                    } else {
                        var data = localStorage.getItem('driverdata');
                        if (data)
                            data = JSON.parse(data);
                        if (data) {
                            if (data == "" || !data[0].country_code) {
                                funcUpdateCountries();
                               
                            }
                        }
                    }
                }
                //Get countries from the server api when app loads for the first time.
                else {
                    var data = localStorage.getItem('driverdata');
                    if (data)
                        data = JSON.parse(data);
                    if (data) {
                        if (data == "" || !data[0].country_code) {
                            funcUpdateCountries();                           
                        }
                    } else {
                        funcUpdateCountries();                       
                    }

                }
            }

            function funcUpdateCountries() {
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
                /* }
                }*/
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
            //Get the index of selected country to update the model
            function funcGetIndex(arr, selected) {
                var arrIndex = jQuery.map(arr, function(e, i) {
                    if (e.code == selected.code) return i;
                })
                return arrIndex.length ? arrIndex[0] : 0;
            }

            getVehicleType();
            //Get vehicles type from API
            function getVehicleType() {
                var el = localStorage.getItem('driverdata');
                //get vehicle info from localStorage on refresh after user has saved his data
                if (el && JSON.parse(el)[2]) {
                    if (el && JSON.parse(el)[2].selectType) {
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
                        if (data && vehicleTypes && makes && models) {
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
                                if ($scope.vehicleinfo.selectType.id)
                                    $scope.selected.selectedVehicleType = $scope.vehicleTypes[funcGetIndexVehicleType($scope.vehicleTypes, $scope.vehicleinfo.selectType.id)];
                                if ($scope.vehicleinfo.make.id)
                                    $scope.selected.selectedMake = $scope.makes[funcGetIndexVehicleType($scope.makes, $scope.vehicleinfo.make.id)];
                                if ($scope.vehicleinfo.model.id)
                                    $scope.selected.selectedModel = $scope.models[funcGetIndexVehicleType($scope.models, $scope.vehicleinfo.model.id)];
                                try {
                                    $scope.$digest();
                                } catch (e) {

                                }
                            }
                        }


                    }
                } else {
                    var data = localStorage.getItem('driverdata');

                    if (data) {
                        if (localStorage.getItem('driverdata') == "" || !JSON.parse(el)[2].selectType) {
                            //Get countries from the server api when app loads for the first time.
                            funcUpdateTypeMakeModels();
                            /*var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getVehicleTypes;
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
                                    "model": {
                                        "id": "1",
                                        "name": "MKT"
                                    }
                                }
                                $scope.getMakes(info);

                            }, function(error) {
                                notify({ classes: 'alert-danger', message: error.message ? error.message : '' });
                            });*/

                        }
                    } else {
                        funcUpdateTypeMakeModels();
                        /*var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getVehicleTypes;
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
                                "model": {
                                    "id": "1",
                                    "name": "MKT"
                                }
                            }
                            $scope.getMakes(info);

                        }, function(error) {
                            notify({ classes: 'alert-danger', message: error.message ? error.message : '' });
                        });*/
                    }

                }

            }

            function funcUpdateTypeMakeModels() {
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
                        "model": {
                            "id": "1",
                            "name": "MKT"
                        }
                    }
                    $scope.getMakes(info);

                }, function(error) {
                    notify({ classes: 'alert-danger', message: error.message ? error.message : '' });
                });
            }

            function funcGetIndexVehicleType(arr, selected) {
                var arrIndex = jQuery.map(arr, function(e, i) {
                    if (e.id == selected) return i;
                })
                return arrIndex.length ? arrIndex[0] : 0;
            }
            //Get selected make based on vehicle type selection
            $scope.getMakes = function(info) {
                var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getMakes;
                services.funcPostRequest(url, { 'vehicle_type_id': $scope.selected.selectedVehicleType.id }).then(function(response) {
                    $scope.makes = response.data.vehicle_makes;
                    if (info && info.make) {
                        jQuery.grep($scope.makes, function(e, i) {
                            if (e.id == info.make.id) {
                                $scope.selected.selectedMake = e;
                            } else {
                                $scope.getModels(info);
                            }
                        })
                    } else {
                        $scope.selected.selectedMake = $scope.makes[0];
                    }
                    $scope.getModels(info);

                }, function(error) {
                    notify({ classes: 'alert-danger', message: error });
                });

            };

            //Get selected model based on vehicle type and make selection
            $scope.getModels = function(info) {
                var url = appSettings.serverPath + appSettings.serviceApis.vehicle_getModels;
                services.funcPostRequest(url, { 'vehicle_type_id': $scope.selected.selectedVehicleType.id, 'vehicle_make_id': $scope.selected.selectedMake.id }).then(function(response) {
                    $scope.models = response.data.vehicle_models;
                    if (info && info.model) {
                        jQuery.grep($scope.models, function(e, i) {
                            if (e.id == info.model.id) {
                                $scope.selected.selectedModel = e;
                            } else {
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

                    insuranceImage:$scope.personalinfo.insurancePic,

                    companyName: $scope.personalinfo.companyName,
                    policyNumber: $scope.personalinfo.policyNumber
                }
            }


            var data = localStorage.getItem('driverdata');
            //card Information
            if (data)
                $scope.cardInfo = JSON.parse(data)[3];
            if ($scope.cardInfo) {
                $scope.card = {
                    cardNumber: $scope.cardInfo.card_number,
                    card_exp_Date: $filter('date')(new Date($scope.cardInfo.card_expiry_date), 'MMyy'),
                    cvvNumber: $scope.cardInfo.card_code

                }
            }

            //File uploads for Licence plate and ARA photos.
            $scope.DriverLicenceUpload = function() {
                $("input[id='dlPicFileUpload']").click();
            }
            $scope.ARAUpload = function() {
                $("input[id='araPicFileUpload']").click();
            }
            $scope.insuranceUpload = function(){
                $("input[id='insurancePicFileUpload']").click();
            }
            $("#dlPicFileUpload").change(function() {
                readURL(this, "dl");
            });
            $("#araPicFileUpload").change(function() {
                readURL(this, "ara");
            });
            $("#insurancePicFileUpload").change(function(){
                readURL(this, "insurance");
            });

            function readURL(input, str) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        if (str === "dl") {
                            $('#dlImg').attr('src', e.target.result);
                            $scope.personal.dlImage = e.target.result;
                            $scope.personal.dlImage_name = input.files[0].name;
                            localStorage.setItem("dlImageName", $scope.personal.dlImage_name);
                        } else if(str === "insurance"){
                            $('#insuranceImg').attr('src', e.target.result);
                            $scope.personal.insuranceImage = e.target.result;
                            $scope.personal.insuranceImage_name = input.files[0].name;
                            localStorage.setItem("insuranceImageName", $scope.personal.insuranceImage_name);
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

            $scope.save_contactInfo = function() {

            
                  $scope.contactinfo = {
                        fullName: $scope.contact.fullName,
                        lastName: $scope.contact.lastName,
                        email: $scope.contact.email,
                        company: $scope.contact.company_name,
                        password: $scope.contact.password,
                        confirmPassword: $scope.contact.confirmPassword,
                        primary_phone_number: $scope.contact.primary_phone_number,
                        primary_address: $scope.contact.primary_address,
                        secondary_address: $scope.contact.secondary_address,
                        city: $scope.contact.city,
                        state_code: $scope.selected.selectedState,
                        country_code: $scope.selected.selectedCountry,
                        zipcode: $scope.contact.zipcode
                    }
                    // $scope.isEnableContactNext = true;
                $scope.localStorageArr[0] = $scope.contactinfo;
                localStorage.setItem("driverdata", JSON.stringify($scope.localStorageArr));
                $scope.isContact = false;
                $scope.isPersonal = true;
                $(".nav_back_btn").hide();
                $scope.isVehicle = false;
                $scope.isCardDetails = false; 
                window.scrollTo(0,0);               
            }
            $scope.save_personalInfo = function() {
                $scope.personalInfo = {
                    dl_number: $scope.personal.dl_number,
                    dlPic: '', //$scope.personal.dlImage,
                    dlImage_name: $scope.personal.dlImage_name,
                    dl_exp_Date: new Date($scope.personal.dl_exp_Date),
                    limo_badge_exp_Date: new Date($scope.personal.limo_badge_exp_Date),
                    limo_badge_number: $scope.personal.limo_badge_number,
                    araPic: '', // $scope.personal.araImage,
                    araImage_name: $scope.personal.araImage_name,
                    ara_exp_Date: new Date($scope.personal.ara_exp_Date),
                    insurance_exp_Date: new Date($scope.personal.insurance_exp_Date),
                    insurancePic:'',
                    companyName: $scope.personal.companyName,
                    policyNumber: $scope.personal.policyNumber
                }
                $scope.localStorageArr[1] = $scope.personalInfo;
                localStorage.setItem("driverdata", JSON.stringify($scope.localStorageArr));
                $scope.isContact = false;
                $scope.isPersonal = false;

                $(".nav_back_btn").hide();
                $scope.isVehicle = true;
                $scope.isCardDetails = false;
                window.scrollTo(0,0);
            }
            $scope.save_vehiclelInfo = function() {
                // $scope.isEnablePersonalNext = true;
                $scope.backBtn = true;
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
                // $scope.isEnableSubmit = true;
                $scope.vehicleInfo = {
                    make: $scope.selected.selectedMake,
                    model: $scope.selected.selectedModel,
                    selectType: $scope.selected.selectedVehicleType,
                    // vehicleId: $scope.vehicle.vehicleId,
                    // selectTypeId:$scope.
                    Color: $scope.vehicle.Color,
                    HLL_Number: $scope.vehicle.HLL_Number,
                    licencePlateNum: $scope.vehicle.licencePlateNum,
                    Features: $scope.featuresArr
                }
                $scope.localStorageArr[2] = $scope.vehicleInfo;
                localStorage.setItem("driverdata", JSON.stringify($scope.localStorageArr));

                $scope.isContact = false;
                $scope.isPersonal = false;
                $scope.isVehicle = false;

                $(".nav_back_btn").hide();
                $scope.isCardDetails = true;
                window.scrollTo(0,0);
            }
            $scope.save_cardInfo = function(data) {
                $scope.backBtn = true;

                if ($scope.step4.$valid) {
                    // alert(data)
                    var cardExpiryData = data;
                    var month = cardExpiryData.month;
                    var year = cardExpiryData.year;
                    if (month.length === 1) {
                        month = '0' + month;
                    }
                    $scope.expiryDate = month + year.toString()[2] + year.toString()[3]; // valid data saving stuff here
                    //console.log("cardExpiryData=", expiryDate);

                }

                $scope.cardInfo = {
                    card_number: $scope.card.cardNumber,
                    //card_holder_name: $scope.card.accHolderName,
                    //card_expiry_date: new Date($scope.card.card_exp_Date),
                    card_expiry_date: $scope.expiryDate,//$filter('date')(new Date($scope.card.card_exp_Date), 'MMyy'),
                    card_code: $scope.card.cvvNumber
                }
                $scope.isContact = false;
                $scope.isPersonal = false;
                $scope.isCardDetails = false;
                $scope.isVehicle = false;

                $(".nav_back_btn").hide();
                $scope.isTermsAndConditions = true;
                window.scrollTo(0,0);
                $scope.localStorageArr[3] = $scope.cardInfo;
                localStorage.setItem("driverdata", JSON.stringify($scope.localStorageArr));
            }

            $scope.Personal_previous = function() {
                $scope.isContact = true;

                $(".nav_back_btn").show();
                $scope.isPersonal = false;
                window.scrollTo(0,0);
            }

            $scope.Vehicle_Previous = function() {
                $scope.isPersonal = true;
                $scope.isVehicle = false;
                window.scrollTo(0,0);
            }
            $scope.card_previous = function() {
                $scope.isVehicle = true;
                $scope.isCardDetails = false;
                $scope.isPersonal = false;
                window.scrollTo(0,0);
            }
            $scope.termsAndConditionsPrevious = function() {
                    $scope.isVehicle = false;
                    $scope.isCardDetails = true;
                    $scope.isPersonal = false;
                    $scope.isTermsAndConditions = false;
                    window.scrollTo(0,0);
            }
                //Submit the form
            $scope.DriverSignup = function() {
                var data = localStorage.getItem('driverdata');
                if (data) {
                    $scope.contactinfo = JSON.parse(data)[0];
                    $scope.personalinfo = JSON.parse(data)[1];
                    $scope.vehicleinfo = JSON.parse(data)[2];
                    $scope.cardinfo = JSON.parse(data)[3];

                }
                if ($scope.personalinfo) {
                    //Get uploaded image names from localStorage
                    var dlImageName = localStorage.getItem("dlImageName");
                    $scope.personalinfo.dlImage_name = dlImageName;
                    var araImageName = localStorage.getItem("araImageName");
                    $scope.personalinfo.araImage_name = araImageName;
                    var insuranceImageName = localStorage.getItem("insuranceImageName");
                    $scope.personalinfo.insuranceImage_name = insuranceImageName;
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

                $scope.driverDetails = {
                    "driver": {
                        first_name: $scope.contactinfo.fullName,
                        last_name: $scope.contactinfo.lastName,
                        password: $scope.contactinfo.password,
                        mobile_number: $scope.contactinfo.primary_phone_number,
                        email: $scope.contactinfo.email,
                        company: $scope.contactinfo.company,
                        address: {
                            street: $scope.contactinfo.primary_address,
                            secondary_address: $scope.contactinfo.secondary_address,
                            city: $scope.contactinfo.city,
                            zipcode: $scope.contactinfo.zipcode,
                            state_code: $scope.contactinfo.state_code.code,
                            country_code: $scope.contactinfo.country_code.code
                        },
                        card_number: $scope.cardinfo.card_number,
                        card_expiry_date: $scope.cardinfo.card_expiry_date,           
                        card_code: $scope.cardinfo.card_code,
                        license_number: $scope.personalinfo.dl_number,
                        license_expiry_date: $scope.personalinfo.dl_exp_Date,
                        license_image: {
                            name: $scope.personalinfo.dlImage_name,
                            image: $scope.personal.dlImage
                        },
                        badge_number: $scope.personalinfo.limo_badge_number,
                        badge_expiry_date: $scope.personalinfo.limo_badge_exp_Date,
                        //ara_number: $scope.personalinfo.ar,
                        ara_expiry_date: $scope.personalinfo.ara_exp_Date,
                        ara_image: {
                            name: $scope.personalinfo.araImage_name,
                            image: $scope.personal.araImage
                        },
                        insurance_company: $scope.personalinfo.companyName,
                        insurance_policy_number: $scope.personalinfo.policyNumber,
                        insurance_expiry_date: $scope.personalinfo.insurance_exp_Date,
                        insurance_image:{
                            name:$scope.personalinfo.insuranceImage_name,
                            image: $scope.personal.insuranceImage
                        }
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
                    AppConstants.driver.company = response.data.company;
                    $window.sessionStorage['driver'] = JSON.stringify(AppConstants.driver);
                    notify({ classes: 'alert-success', message: response.message });
                    localStorage.clear();
                    $state.go('core.appSettings');
                }, function(error) {
                    notify({ classes: 'alert-danger', message: error.message });
                    $state.go('core.signup');
                });
            }


            // $scope.ListOfItems = [{
            //     isSelected: false,
            //     desc: 'This application is for independent limo drivers to become a member of limologix nnetwork.The independenr limo driver will be known as a driver mwmber("DM")'
            // }, {
            //     isSelected: false,
            //     desc: "Limo Logix reservs the right to terminate any DM eho misuses the limo logix network and service"
            // }, {
            //     isSelected: false,
            //     desc: 'DM has the right to use benifits of the limo logix network and website anywhere in the US that Limo Logix provides their service'
            // }, {
            //     isSelected: false,
            //     desc: 'DM will provide Limo Logix with all up-to-date driver information ,car information or background checks.Limo Logix will periodically check-in to ensure they have the most up-to-date information.'
            // }, {
            //     isSelected: false,
            //     desc: 'Limo Logix is the only authority to manage the Limo Logix website.'
            // }, {
            //     isSelected: false,
            //     desc: 'DM will immiditely become a user of the Limo Logix website once the independent driver Application is completed '
            // }, {
            //     isSelected: false,
            //     desc: 'limo logix will not collect any charges for the DM from limo companies and all charge for trip will be between the limo companies and DM. Limo Logix is not responsible for any froud or dispute between the limo company and the DM.'
            // }, {
            //     isSelected: false,
            //     desc: 'When a DM needs assistance with a dispute with the limo company, they should contact Local Limo association,the city or national limo association on their own.'
            // }, {
            //     isSelected: false,
            //     desc: 'DMs are all equal and have the right to get all benifits of the limo logix network and website equally.'
            // }];

            $scope.AllSelectedItems = false;
            $scope.NoSelectedItems = false;

        }
    ])
.directive('cardExpiration', function() {
        var directive = {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                scope.$watch('[card.month,card.year]', function(value) {
                    ctrl.$setValidity('invalid', true)
                    if (scope.card.year == scope.currentYear && scope.card.month <= scope.currentMonth) {
                        ctrl.$setValidity('invalid', false)
                    }
                    return value;
                }, true)
            }
        }
        return directive;
    })

.filter('range', function() {
    var filter =
        function(arr, lower, upper) {
            for (var i = lower; i <= upper; i++) arr.push(i)
            return arr
        }
    return filter
})

.controller('DatepickerTripCtrl', ['$scope', function($scope) {
        $scope.today = function() {
            //update exp dates
            if ($scope.personal) {
                $scope.personal.dl_exp_Date = $scope.personal.dl_exp_Date ? new Date($scope.personal.dl_exp_Date) : new Date();
                $scope.personal.limo_badge_exp_Date = $scope.personal.limo_badge_exp_Date ? new Date($scope.personal.limo_badge_exp_Date) : new Date();
                $scope.personal.ara_exp_Date = $scope.personal.ara_exp_Date ? new Date($scope.personal.ara_exp_Date) : new Date();
                $scope.personal.insurance_exp_Date = $scope.personal.insurance_exp_Date ? new Date($scope.personal.insurance_exp_Date) : new Date();
            }
            // if ($scope.card) {
            //     $scope.card.card_exp_Date = $scope.card.card_exp_Date ? new Date($scope.card.card_exp_Date) : new Date();
            // }
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
    
