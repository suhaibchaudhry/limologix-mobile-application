'use strict';


app.provider('services', [funcservices]);

function funcservices() {
	return {
		$get: function ($http, $q) {
			return {
				funcGetRequest: function (path,data) {
					var responseToken = $q.defer();
					$http.get(path,data).success(function (data, status) {
						responseToken.resolve(data);
					}).error(function (error) {
						responseToken.reject(error);
					});
					return responseToken.promise;
				},



				funcPostRequest: function (path, postData) {
					var responseToken = $q.defer();
					$http.post(path, postData).success(function (data, status) {
						responseToken.resolve(data);
					}).error(function (error) {
						responseToken.reject(error);
					});
					return responseToken.promise;
                },



				funcPutRequest: function (path, putData) {
					var responseToken = $q.defer();
					$http.put(path, putData).success(function (data, status) {
						responseToken.resolve(data);
					}).error(function (error) {
						responseToken.reject(error);
					});
					return responseToken.promise;
                },
                
                funcDeleteRequest: function (path) {
					var responseToken = $q.defer();
					$http.delete(path).success(function (data, status) {
						responseToken.resolve(data);
					}).error(function (error) {
						responseToken.reject(error);
					});
					return responseToken.promise;
				}
			};
		}
	}

}