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