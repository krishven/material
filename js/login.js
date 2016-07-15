var app = angular.module('altavault', []);

/*app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});*/

/*app.factory('authInterceptor', function ($rootScope, $q, $window) {
	return {
		request: function (config) {
			config.headers = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			return config;
		},
		response: function (response) {
			if (response.status === 401) {
				// handle the case where the user is not authenticated
			}
			return response || $q.when(response);
		}
	};
});

app.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});*/

app.controller('login', function($scope, $window, $http) {
	$scope.loading = false;
	$scope.auth = function(username, password) {
		$scope.loading = true;
		//$window.sessionStorage.token = '752aa6bd-4702-43a3-85b9-00fff9c6a51b';
		$window.alert('Hello');
		//$window.location.href = 'index.html';

		$http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('altavault' + ':' + 'AVS3cr3t');
		var xsrf = $.param({username: 'siva', password: 'saycheese', grant_type:'password'});
		$http({
				url: 'https://172.16.33.180:8443/capi/v1/auth/login',
				method: 'POST',
				data: xsrf,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
					//handle success
					$window.alert("Success");
					console.log(data);
		}).error(function (data, status, headers, config) {
					//handle error
					$window.alert("Error");
					console.log(data);
		});
	};
});