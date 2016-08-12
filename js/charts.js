//Controller for graphs/charts
app.controller('charts', function($scope, $window, $http, graphite, $filter) {
	//global instance of the chart
	var chart = null;
	//set default range for live graph
	$scope.range = 5;

	//function to swap [value,time] to [time,value] in Graphite response
	$scope.swap = function(resp) {
		var y = [];
		for(var index = 0; index < resp[0].datapoints.length; index++) {
			if(resp[0].datapoints[index][0] != null) {
				var x = [];
				x.push(resp[0].datapoints[index][1]*1000);
				x.push(resp[0].datapoints[index][0]);
				y.push(x);
			}
		}
		return y;
	}

	//function to add a new line to the existing graph
	//stat is the stat's name, from and until are time, limit is the zone after which line must be drawn in a different colour, title is the graph title
	$scope.addLine = function(stat, from, until, limit, title) {
		$http.get(graphite.url(stat, from, until, 'json'))
		.then(function(response) {
			var resp = response.data;
			var datapoints = $scope.swap(resp);
			chart.addSeries({
				name: title,
				data: datapoints,
				zones: [{
	                value: limit,
	                color: 'black'
	            }, {
                	color: 'orange'
            	}]
			});
		});
	}

	//function to update range of the graph once the slider is readjusted
	$scope.updateRange = function () {
		$scope.drawLine('sar.q.ldavg-1', '-'+$scope.range+'min', '', 2, 'Load Average');
	}


	//takes arguments like stats name, from what time, to what time, limit upto which one color has to be displayed and title of the graph
	$scope.drawLine = function(stat, from, until, limit, title) {
		$http.get(graphite.url(stat, from, until, 'json'))
	    .then(function(response) {
	        var resp = response.data;
	        var datapoints = $scope.swap(resp);
			var prev = datapoints[datapoints.length-1][0];

	        chart = new Highcharts.Chart({
	            chart: {
	                zoomType: 'x',
	                renderTo: 'chart1',
	                events: {
	                    load: function () {
	                        // set up the updating of the chart each second
	                        var series = this.series[0];
	                        setInterval(function () {
	                        	if($scope.liveStatus) {
		                            $http.get(graphite.url(stat, '-1min', '', 'json'))
								    .then(function(response) {
								        var resp = response.data;
								        var datapoints = $scope.swap(resp);
								        for(var index = 0; index < datapoints.length; index++) {
									        if(prev < datapoints[index][0]) {
									        	for(; index < datapoints.length; index++) {
									        		//the addPoint takes arguments:
									        		//1. [x, y] array of the new point, redraw(Whether to redraw the chart after the point is added)
									        		//2. whether to shift the graph one point 
									        		//3. whether to animate the graph
			                            			series.addPoint(datapoints[index], false, true, true);
			                            			prev = datapoints[index][0];
			                            		}
			                            		//add all points then redraw the graph for smoother animation
			                            		chart.redraw();
			                            		break;
			                            	}
		                            	}
		                        	});
								}
	                        }, 2000);
	                    }
	                }
	            },
	            title: {
	                text: title
	            },
	            xAxis: {
	                type: 'datetime'
	            },
	            yAxis: {
	            	title: {
	                    text: title
	                }
	            },
	            tooltip: {
	            	shared: true
	            },
	            legend: {
	                enabled: true
	            },
	            series: [{
	                type: 'spline',
	                name: title,
	                data: datapoints,
	                //can add many zones, each object represents the value upto which the particular color will be used
	                zones: [{
		                value: limit,
		                color: 'green'
		            }, {
	                	color: 'red'
	            	}]
	            }]
	        });
	    });
	}

	//function to quesry the graphite db according to different needs eg live or static or add a new stat or csv etc
	//instead of sending the entire string name of the stat, it can be done dynamically with the mapping of stat name to stat url in a separate JSON object
	$scope.queryDB = function(value) {
    	if(value == 'live')
    		$scope.drawLine('sar.q.ldavg-1', '-5min','', 1, 'Load Average');
    	else {
    		var from = '', until = '';
    		$scope.liveStatus = false;
    		//atleast from is neded so check if from date has been entered properly
    		if(!($scope.fromtime === undefined || $scope.fromdate === undefined)) {
	    		from += $filter('date')($scope.fromtime, "HH:mm") + '_';
	    		from += $filter('date')($scope.fromdate, "yyyyMMdd");
	    		//to date is optional but check if entered properly then cosntruct the string
	    		if(!($scope.totime === undefined || $scope.todate === undefined)) {
	    			until += $filter('date')($scope.totime, "HH:mm") + '_';
	    			until += $filter('date')($scope.todate, "yyyyMMdd");
	    		}
	    		if(value == 'csv')
	    			window.location.href = graphite.url('rfs.megastore.replicated_maps.count', from, until, 'csv');
	    		else if(value == 'addLine')
	    			$scope.addLine('rfs.megastore.replicated_slabs.count', from, until, 200, 'Replicated Slabs');
	    		else
	    			$scope.drawLine('rfs.megastore.replicated_maps.count', from, until, 200, 'Replicated Maps');
	    	}
    	}
  	}
});