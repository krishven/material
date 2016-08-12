//This file holds all the global factories and initialization code

var app = angular.module('altavault', []);

Highcharts.setOptions({
	global: {
		timezoneOffset: 6 * 60
	}
});

//The auth interceptor factory that interecepts every http request
app.factory('authInterceptor', function ($rootScope, $q, $window) {
	return {
		request: function (config) {
			config.headers = config.headers || {};
			//If session token has been set, add it to the header as Bearer
			if ($window.sessionStorage.token)
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			return config;
		},
		response: function (response) {
			return response || $q.when(response);
		},
		'responseError': function(rejection) {
			//If there is an error in response, set error cookie appropriately
	      	$window.sessionStorage.error = rejection.status;
	        return $q.reject(rejection);
    	}
	};
});

//Register factory 'authInterceptor' as the http interceptor
app.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});

//factory for constructing graphite URL query
app.factory('graphite', function() {
    return {
        url: function(stat, from, until, format) {
			var port = 1790;
			var serial = 'VMware-42293769517d3730-55cdb9caec02618b';
			var url = 'https://'+document.location.hostname+':'+port+'/render/?target='+ serial +'.'+stat;
			url += '&from='+from;
			//until can be empty so check for empty string
			if(until)
				url += '&until='+until;
			url += '&format='+format;
			console.log(url);
			return url;
		}
    };
});