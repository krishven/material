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