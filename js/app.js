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

app.filter('convertBytes', function() {
    return function(input) {
    	return (parseInt(input, 10)/1024/1024/1024);
    };
});

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

app.controller('charts', function($scope, $window, $http) {
	$scope.split = function(resp) {
		var x = [];
		var y = [];
		for(var index = 0; index < resp[0].datapoints.length; index++) {
			if(resp[0].datapoints[index][0] != null) {
				x.push(moment.unix(resp[0].datapoints[index][1]).format('LT'));
				y.push(resp[0].datapoints[index][0]);
			}
		}
		console.log(x);
		console.log(y);
		return [x, y];
		//data = JSON.stringify(data, null, '\t');
		//return data;
	}

	$http.get("http://ripple.gdl.englab.netapp.com:1789/render/?target=012345678912.sar.q.ldavg-1&from=-1h&to=-1h&format=json")
    .then(function(response) {
        var resp = response.data;
        var data = $scope.split(resp);

        //SIMPLE LINE CHART
		new Chartist.Line('#chart1', {
		  labels: data[0],
		  series: [
		    data[1]
		  ]
		}, {
		  fullWidth: true,
		  chartPadding: {
		    right: 40
		  }
		});
    });

    $http.get("http://ripple.gdl.englab.netapp.com:1789/render/?target=012345678912.sar.q.ldavg-5&from=-1h&format=json")
    .then(function(response) {
        var resp = response.data;
        var data = $scope.split(resp);

        //SIMPLE LINE CHART
		new Chartist.Line('#chart2', {
		  labels: data[0],
		  series: [
		    data[1]
		  ]
		}, {
		  fullWidth: true,
		  chartPadding: {
		    right: 40
		  }
		});
    });

    $http.get("http://ripple.gdl.englab.netapp.com:1789/render/?target=scale(sumSeries(012345678912.sar.d.*.wr_sec.rate),512)&from=-1h&format=json")
    .then(function(response) {
        var resp = response.data;
        var data = $scope.split(resp);

        //SIMPLE LINE CHART
		new Chartist.Line('#chart3', {
		  labels: data[0],
		  series: [
		    data[1]
		  ]
		}, {
		  fullWidth: true,
		  chartPadding: {
		    right: 40
		  }
		});
    });

	/*$http.get("http://ripple.gdl.englab.netapp.com:1789/render/?target=012345678912.rfs.megastore.io_reqs.rate&from=-4h&format=json")
    .then(function(response) {
        var resp = response.data;

        // Create a new JavaScript Date object based on the timestamp
		// multiplied by 1000 so that the argument is in milliseconds, not seconds.
		var date = moment.unix(resp[0].datapoints[10][1]).format('LT');

        console.log(date);
        console.log(JSON.stringify(resp[0].datapoints[0]));
    });*/
});

app.controller('cards', function($scope, $window, $http) {
	//Convert bytes in string to float
	$scope.getColor = function(str) {
		if(str == 'not ready' || str == 'stopped' || str == 'Unknown')
			return 'red';
		else
			return 'green';
	}

	//Convert bytes in string to float
	$scope.convertBytes = function(str) {
		var ret = (parseInt(str, 10))/1024/1024/1024;
		return ret.toFixed(2); //to reduce to 2 decimal places
	}

	//Convert size to string with GB/TB appended
	$scope.toStr = function(num) {
		if(num > 1024) {
			var ret = num/1024;
			return ret + ' TB';
		}
		else if(num < 1024)
			return num + ' GB';
		else
			return num;
	}

	$scope.reason = false;
	$scope.alarms = false;
	$scope.storageOpt = false;
	$scope.reclam = false;

	$scope.result = {
		"cloudInformation": {
			"cloudConnection": "Connected",
			"cloudConnectionClass": "stateUnknown",
			"cloudProvider": "Amazon S3",
			"storageClass": "Standard"
		},
		"systemInformation": {
			"applianceTime": "Wednesday 06:04:20 GMT",
			"serviceUptime": "6 days, 2:54:43",
			"systemUptime": "19 days, 14:25:22"
		},
		"serviceStateData": {
			"blockedReason": "No data partition was found. Please shut down the VM and attach a second disk.",
			"enabled": "true",
			"readyState": "not ready",
			"serviceState": "stopped",
			"info": ""
		},
		"replicationInformation": {
			"cloudSync": "0",
			"latestReplicationBytes": "Storage Optimization service is not ready",
			"replicationETA": "Storage Optimization service is not ready",
			"serviceReady": "false"
		},
		"alarmsTriggered": [
			{
				"name": "Appliance Health",
				"status": "Critical"
			},
			{
				"name": "Storage Optimization Service",
				"status": "Critical"
			},
			{
				"name": "Storage Optimization Service Down",
				"status": "Critical"
			}
		],
		"storageOptimizationData": {
			"rfsdEnabled": false,
			"expandedData": null,
			"dedupedData": null,
			"dedupFactor": null
		},
		"storageAllocationData": {
			"cloudFree": "10995116277760",
			"cloudLicensedTotal": "10995116277761",
			"cloudUsed": "-1",
			"diskFree": "2098520064",
			"diskUsed": "1003646977",
			"diskTotal": "3102167040"
		},
		"garbageCollectionService": {
			"gcProgress": "0",
			"gcRunning": false
		},
		"fipsStatus": {
			"fipsEnabled": false,
			"fipsInfoMsg": ""
		}
	}

	if($scope.result.serviceStateData.serviceState)
		$scope.reason = true;
	if($scope.result.alarmsTriggered)
		$scope.alarms = true;
	if($scope.result.storageOptimizationData.rfsdEnabled == true)
		$scope.storageOpt = true;
	if($scope.result.garbageCollectionService.gcRunning == true)
		$scope.reclam = true;	

	$scope.serviceColor = $scope.getColor($scope.result.serviceStateData.serviceState);
	$scope.readyColor = $scope.getColor($scope.result.serviceStateData.readyState);

	$scope.cloudTotal = $scope.convertBytes($scope.result.storageAllocationData.cloudLicensedTotal);
	$scope.cloudUsed = $scope.convertBytes($scope.result.storageAllocationData.cloudUsed);
	$scope.cloudFree = $scope.convertBytes($scope.result.storageAllocationData.cloudFree);
	$scope.diskTotal = $scope.convertBytes($scope.result.storageAllocationData.diskTotal);
	$scope.diskUsed = $scope.convertBytes($scope.result.storageAllocationData.diskUsed);
	$scope.diskFree = $scope.convertBytes($scope.result.storageAllocationData.diskFree);
	$scope.repBytes = $scope.convertBytes($scope.result.replicationInformation.cloudSync);

	if($scope.repBytes == 0)
		$scope.repBytes = 'No data has been replicated to the cloud';

	/*$scope.hello = function() {
		$window.alert($scope.result.cloudInformation.cloudProvider);
	};*/
	
	Morris.Donut({
		colors: ['#0277bd','#81d4fa'],
        element: 'cloud',
        data: [{
            label: 'Cloud Used',
            value: $scope.cloudUsed
        }, {
            label: 'Cloud Free',
            value: $scope.cloudFree
        }],
        formatter: function(y) {
            return $scope.toStr(y);
        }
    });

    Morris.Donut({
    	colors: ['#a1887f','#bcaaa4'],
        element: 'disk',
        data: [{
            label: 'Disk Used',
            value: $scope.diskUsed
        }, {
            label: 'Disk Free',
            value: $scope.diskFree
        }],
        formatter: function(y) {
            return $scope.toStr(y);
        }
    });

	/*$http({
		url: 'http://10.192.5.98:1234/capi/v1/dashboard', method: 'GET'
	}).success(function (data, status, headers, config) {
		console.log('Success'+data.name); // Should log 'foo'
	}).error(function (data, status, headers, config) {
		console.log('Error');
	});*/
});