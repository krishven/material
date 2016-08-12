//Controller for the login page
app.controller('login', function($scope, $window, $http) {
	//donot show loading bar and error message
	$scope.loading = false;
	$scope.errorMsg = false;

	//clear session token
	if ($window.sessionStorage.token)
		delete $window.sessionStorage.token;

	//query REST with user provided username and password
	$scope.auth = function(user, pass) {
		//show loading bar but hide error message
		$scope.loading = true;
		$scope.errorMsg = false;

		var data = $.param({username: user, password: pass, grant_type:'password'});
		$http({
				url: 'https://172.16.33.115:8443/cbapi/v1/auth/login',
				method: 'POST',
				data: data,
				headers: {
    				'Authorization': 'Basic ' + btoa('altavault' + ':' + 'AVS3cr3t'),
					'Content-Type': 'application/x-www-form-urlencoded'
				}
		}).success(function (data, status, headers, config) {
			//set session token
			$window.sessionStorage.token = data.access_token;
			//redirect to home page/dashboard
			$window.location.href = 'index.html';
		}).error(function (data, status, headers, config) {
			//hide loading bar and show error message
			$scope.loading = false;
			$scope.error = true;
		});
	};
});