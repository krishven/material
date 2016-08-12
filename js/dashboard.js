//controller for dashboard
app.controller('dashboard', function($scope, $interval, $window, $http) {
	//initialize result array which will hold dashboard response
	$scope.result = {};

	$scope.reason = false;
	$scope.alarms = false;
	$scope.storageOpt = false;
	$scope.reclam = false;

	//pie charts global variables
	var cloud, disk;

	//functionping REST and try to get dashboard response
	//update is the argument that differentiates between the first request and subsequent requests
	$scope.getDashboard = function(update) {
    	$http({
			url: 'https://172.16.33.115:8443/cbapi/v1/dashboard', method: 'GET'
		}).success(function (data, status, headers, config) {
			$scope.displayDashboard(data.result, update);
		}).error(function (data, status, headers, config) {
			$window.location.href = 'error.html';
		});
    }

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
			return  ret.toFixed(2) + ' TB';
		}
		else if(num < 1024)
			return num + ' GB';
		else
			return num;
	}

	//object is the response from REST, update is the argument that differentiates between the first request and subsequent requests
	$scope.displayDashboard = function(object, update) {
		$scope.result = object;

		if($scope.result.serviceStateData.blockedReason)
			$scope.reason = true;
		if($scope.result.alarmsTriggered.length != 0)
			$scope.alarms = true;
		if($scope.result.storageOptimizationData.rfsdEnabled == true)
			$scope.storageOpt = true;
		if($scope.result.garbageCollectionService.gcRunning == true)
			$scope.reclam = true;	

		//colours for displaying status red or green
		$scope.serviceColor = $scope.getColor($scope.result.serviceStateData.serviceState);
		$scope.readyColor = $scope.getColor($scope.result.serviceStateData.readyState);

		//calculate all the stats in bytes to GB and TB
		$scope.cloudTotal = $scope.convertBytes($scope.result.storageAllocationData.cloudLicensedTotal);
		$scope.cloudUsed = $scope.convertBytes($scope.result.storageAllocationData.cloudUsed);
		$scope.cloudFree = $scope.convertBytes($scope.result.storageAllocationData.cloudFree);
		$scope.diskTotal = $scope.convertBytes($scope.result.storageAllocationData.diskTotal);
		$scope.diskUsed = $scope.convertBytes($scope.result.storageAllocationData.diskUsed);
		$scope.diskFree = $scope.convertBytes($scope.result.storageAllocationData.diskFree);
		$scope.repBytes = $scope.convertBytes($scope.result.replicationInformation.cloudSync);
		
		//If update nad not the first request then just update the pie chart, no need to redraw it again
		if(update) {
			disk.series[0].data[0].update(parseFloat($scope.diskUsed));
			disk.series[0].data[1].update(parseFloat($scope.diskFree));
			cloud.series[0].data[0].update(parseFloat($scope.cloudUsed));
			cloud.series[0].data[1].update(parseFloat($scope.cloudFree));
		}
		//else if the first request, create the pie charts
		else {
			cloud = new Highcharts.Chart({
		        chart: {
		        	renderTo: 'cloud',
		        	type: 'pie'
		      	},
		      	colors: ['#3f51b5'],
		      	title: {
		        	text: 'Total '+ $scope.toStr($scope.cloudTotal),
		        	verticalAlign: 'middle',
		    		floating: true
		      	},
		      	tooltip: {
				    formatter: function() {
				        return this.point.name +' '+ $scope.toStr(this.y)
				    }
				},
		      	plotOptions: {
		        	pie: {
		          		dataLabels: {
		            		enabled: false
			          	},
			          	point: {
			            	events: {
				              	mouseOver: function() {
				                	cloud.setTitle({text: this.name +' '+ $scope.toStr(this.y)});
				              	},
				              	mouseOut: function() {
				                	cloud.setTitle({text: 'Total '+$scope.toStr($scope.cloudTotal)});
				              	}
			          	  	}
			          	}
		        	}
		      	},
		      	series: [{
		            name: 'Cloud',
		            data: [["Used", parseFloat($scope.cloudUsed)], ["Free", parseFloat($scope.cloudFree)]],
		            size: '100%',
		            innerSize: '50%'
		        }]
		    });

		    disk = new Highcharts.Chart({
		        chart: {
		        	renderTo: 'disk',
		        	type: 'pie'
		      	},
		      	title: {
		        	text: 'Total '+$scope.toStr($scope.diskTotal),
		        	verticalAlign: 'middle',
		    		floating: true
		      	},
		      	tooltip: {
				    formatter: function() {
				        return this.point.name +' '+ $scope.toStr(this.y)
				    }
				},
		      	plotOptions: {
		        	pie: {
		          		dataLabels: {
		            		enabled: false
			          	},
			          	point: {
			            	events: {
				              	mouseOver: function() {
				                	disk.setTitle({text: this.name +' '+ $scope.toStr(this.y)});
				              	},
				              	mouseOut: function() {
				                	disk.setTitle({text: 'Total '+$scope.toStr($scope.diskTotal)});
				              	}
			          	  	}
			          	}
		        	}
		      	},
		      	series: [{
		            name: 'Disk',
		            data: [["Used", parseFloat($scope.diskUsed)], ["Free", parseFloat($scope.diskFree)]],
		            size: '100%',
		            innerSize: '50%'
		        }]
		    });
		}
	}

	//the argument false specifies that this is NOT AN UPDATE i.e this is the first time the pie chart is being drawn
	$scope.getDashboard(false);

	//use $interval to query the REST dashboard repeatedly for every 3 seconds i.e 3000 ms
	//the argument true specifies that the pie chart needs to be updated and not drawn again.
	$interval(function(){ $scope.getDashboard(true); }, 3000);
});