//Controller for the error page
app.controller('error', function($scope, $window) {
	$scope.error = $window.sessionStorage.error;
});