'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:UpdateInfoCtrl
 * @description
 * # UpdateInfoCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('UpdateInfoCtrl', [
        '$scope', '$rootScope', '$http', 'appSettings', '$window', 'notify', '$timeout', 'services', '$q', 'countriesConstant',
        function($scope, $rootScope, $http, appSettings, $window, notify, $timeout, services, $q, countriesConstant) {
            $scope.page = {
                title: 'Company Information',
                subtitle: '' //'Place subtitle here...'
            };
            var vm = this;
            $scope.base64Img = '';
            $scope.phoneNumbr = /^\+?\d{1}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            //     $scope.countryCode = 'US';
            //     $scope.stateCode = 'AK';
            $scope.companyInfo = {
                name: '',
                email: '',
                primary_phone_number: '',
                logo: {
                    name: '',
                    image: ''
                },
                secondary_phone_number: '',
                fax: '',
                street: '',
                city: '',
                zipcode: '',
                picFile: ''
            }
            //Model which handles selected country and state update
            $scope.selected = {}
            $scope.loggedUser = countriesConstant.user.name;
            getCountries();
            //Get countries from API
            function getCountries() {
                //Load countries and keep them in constants on app load and get countries from constants
                if (countriesConstant.countries.length) {
                    $scope.countries = countriesConstant.countries;
                    $scope.selected.selectedCountry = $scope.countries[0];
                    getCompanyInfo().then(function(address) {
                        $scope.GetSelectedCountry(address);
                    });
                } else {
                    var url = appSettings.serverPath + appSettings.serviceApis.company_getCountries;
                    services.funcGetRequest(url).then(function(response) {
                        $scope.countries = response.data;
                        countriesConstant.countries = $scope.countries;
                        $scope.selected.selectedCountry = $scope.countries[0];
                       // if(countriesConstant.user['Auth-Token']){
                           getCompanyInfo().then(function(address) {
                            $scope.GetSelectedCountry(address);
                            });         
                      //  }
                        
                    }, function(error) {
                        notify({ classes: 'alert-danger', message: error.message });
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


            //Get company details from the service.
            function getCompanyInfo() {
                var responseToken = $q.defer();
                var url = appSettings.serverPath + appSettings.serviceApis.company_info;
                services.funcGetRequest(url).then(function(response,status) {
                    var response = response.data.company;
                    $scope.companyInfo = {
                        name: response.name,
                        email: response.email,
                        primary_phone_number: response.primary_phone_number,
                        logo: {
                            name: response.logo.name,
                            image: appSettings.server_address + response.logo.image
                        },
                        secondary_phone_number: response.secondary_phone_number,
                        fax: response.fax,
                        street: response.address ? response.address.street : '',
                        city: response.address ? response.address.city : '',
                        zipcode: response.address ? response.address.zipcode : ''
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
            //Update company details
            $scope.submitForm = function(isValid) {
                if (isValid) {
                    var bool = $rootScope.logo_image ? true : false;
                    var imageUrl =  $rootScope.logo_image ? $rootScope.logo_image: $scope.companyInfo.logo.image;
                    toDataUrl(imageUrl,bool, function(base64Img) {
                        // Base64DataURL
                        $scope.base64Img = base64Img;
                        $scope.logo_name = $rootScope.logo_name ? $rootScope.logo_name : $scope.companyInfo.logo.name;
                        $scope.logo_image = $rootScope.logo_image ? $rootScope.logo_image : $scope.base64Img;
                        var company = {
                            name: $scope.companyInfo.name,
                            email: $scope.companyInfo.email,
                            primary_phone_number: $scope.companyInfo.primary_phone_number,
                            logo: {
                                name: $scope.logo_name,
                                image: $scope.logo_image
                            },
                            secondary_phone_number: $scope.companyInfo.secondary_phone_number,
                            fax: $scope.companyInfo.fax,
                            address: {
                                street: $scope.companyInfo.street,
                                city: $scope.companyInfo.city,
                                zipcode: $scope.companyInfo.zipcode,
                                state_code: $scope.selected.selectedState.code,
                                country_code: $scope.selected.selectedCountry.code
                            }
                        };
                        var url = appSettings.serverPath + appSettings.serviceApis.company_update;
                        $http.post(url, { "auth_token": $window.sessionStorage['token'], "company": company })
                            .success(function(response) {
                                notify({ classes: 'alert-success', message: response.message });
                            })
                            .error(function(response, status) {
                                notify({ classes: 'alert-danger', message: response.message });
                            });
                    });
                } else {
                    console.log('form is invalid');
                }
            };
        }
    ]);
