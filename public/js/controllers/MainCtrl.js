var app = angular.module('weatherApp',['gm']);
var skycons = new Skycons({"color": "black"});

app.controller('MainController',['$scope','$http','$window', function($scope,$http,$window) {


	$scope.historicData = [];
	$scope.historicTemp = [];
	$scope.historicHumidity = [];
	$scope.historicCloudCover = [];
	$scope.currentUser = {};
	$scope.historyHidden = true;

	$scope.$on('gmPlacesAutocomplete::placeChanged', function(){
		if($scope.autocomplete){
			var location = $scope.autocomplete.getPlace().geometry.location;
			$scope.lat = location.lat();
			$scope.lng = location.lng();
			$scope.search = $scope.autocomplete.getPlace().name;
			$scope.$apply();
		}
	});

	$scope.submit = function() {
		$scope.historicData = [];
		$scope.historicTemp = [];
		$scope.historicHumidity = [];
		$scope.historicCloudCover = [];

		$http.post('/api/weather',{lat: $scope.lat, lng: $scope.lng}).then(function(response){
			$scope.currentTemp = response.data.currently.apparentTemperature;
			$scope.currentSummary = response.data.currently.summary;
			$scope.currentWindSpeed = response.data.currently.windSpeed;
			$scope.currentCloudCover = response.data.currently.cloudCover;
			$scope.currentForecast = response.data.forecast.summary;
			$scope.icon1 = response.data.currently.icon;
			$scope.icon2 = response.data.forecast.icon;
			setSkycon("icon1",$scope.icon1);
			setSkycon("icon2", $scope.icon2);
			skycons.play();
			$scope.time = response.data.currently.time;
			$scope.date = formatDate($scope.time);
			$scope.newTime = getPastTime($scope.time,24);
			$scope.newDate = formatDate(getPastTime($scope.time,24));

			$http.post('/api/weather/past',{lat: $scope.lat, lng: $scope.lng, time: $scope.date}).then(function(response){
				$scope.historicData = response.data.hourly.data;
				$scope.historicTemp = generateArray($scope.historicData, $scope.historicTemp, 'temperature');
				$scope.historicHumidity = generateArray($scope.historicData, $scope.historicHumidity, 'humidity');
				$scope.historicCloudCover = generateArray($scope.historicData, $scope.historicCloudCover, 'cloud_cover');
				displayChart();
			});

			if($scope.currentUser.name){

				$http.post('/api/user/searches',{username:$scope.currentUser.name, search:$scope.search}).then(function(response){
					$scope.currentUser.searches = response.data.user.searches;
				});
			}
		});
	};

	$scope.signin = function(){
		$http.get('api/user?username='+$scope.usernameL+'&password='+$scope.passwordL).then(function(response) {
			if(response.data.user !== null){
				$scope.currentUser.name = response.data.user.username;
				$scope.currentUser.searches = response.data.user.searches;
			}
		}).catch(function(response) {
			alert('Login Error', response.status, response.data);
		});
	};

	$scope.register = function(){
		$http.post('/api/user',{username: $scope.username, password:$scope.password}).then(function(response){
			$scope.currentUser.name = $scope.username;
		});
	};

	$scope.showHistory = function() {
		$http.get('/api/user/searches?username='+$scope.currentUser.name).then(function(response){
			$scope.currentUser.searches = response.data.user.searches;
			$scope.historyHidden = false;
			$scope.historyShow = true;
		});
	}

	$scope.hideHistory = function(){
		$scope.historyShow = undefined;
		$scope.historyHidden = true;
	}

	$scope.signOut = function(){
		$scope.currentUser = undefined;
		window.location.reload(true);
	}

	var setSkycon = function(id,icon){
		skycons.remove(id);
		switch(icon){
			case "clear-day":
			skycons.add(id, Skycons.CLEAR_DAY);
			break;
			case "clear-night":
			skycons.add(id, Skycons.CLEAR_NIGHT);
			break;
			case "partly-cloudy-day":
			skycons.add(id, Skycons.PARTLY_CLOUDY_DAY);
			break;
			case "partly-cloudy-night":
			skycons.add(id, Skycons.PARTLY_CLOUDY_NIGHT);
			break;
			case "cloudy":
			skycons.add(id, Skycons.CLOUDY);
			break;
			case "rain":
			skycons.add(id, Skycons.RAIN);
			break;
			case "sleet":
			skycons.add(id, Skycons.SLEET);
			break;
			case "snow":
			skycons.add(id, Skycons.SNOW);
			break;
			case "wind":
			skycons.add(id, Skycons.WIND);
			break;
			case "fog":
			skycons.add(id, Skycons.FOG);
			break;
		}
	}

	var getPastTime = function(currentTime,hours){
		return currentTime-hours*60*60;
	};

	function timeToDate(time){

		var date = new Date(time*1000);
		return date.toDateString();
	}
	//format date from string "Mon Mar 26 2018" to '2018-03-26'
	function formatDate(time) {
		var date = new Date(time*1000);
		var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}


	var displayChart = function () {

		var myChart = Highcharts.chart('container', {
			title: {
				text: 'Past 24 Hour Weather Data'
			},
			xAxis: {
				type: 'datetime',
				labels: {
					format: '{value:%b-%e-%H:%M}'
				}
			},
			yAxis: [{ // Primary yAxis
				labels: {
					format: '{value}°C',
					style: {
						color: Highcharts.getOptions().colors[2]
					}
				},
				title: {
					text: 'Temperature',
					style: {
						color: Highcharts.getOptions().colors[2]
					}
				}

			    }, { // Secondary yAxis
			    	gridLineWidth: 0,
			    	title: {
			    		text: 'Cloud Cover',
			    		style: {
			    			color: Highcharts.getOptions().colors[0]
			    		}
			    	},
			    	labels: {
			    		format: '{value} %',
			    		style: {
			    			color: Highcharts.getOptions().colors[0]
			    		}
			    	},
			    	opposite: true

			    }, { // Tertiary yAxis
			    	gridLineWidth: 0,
			    	title: {
			    		text: 'Humidity',
			    		style: {
			    			color: Highcharts.getOptions().colors[1]
			    		}
			    	},
			    	labels: {
			    		format: '{value} %',
			    		style: {
			    			color: Highcharts.getOptions().colors[1]
			    		}
			    	},
			    	opposite: true
			    }],
			    tooltip: {
			    	shared: true
			    },
			    legend: {
			    	layout: 'vertical',
			    	align: 'left',
			    	x: 80,
			    	verticalAlign: 'top',
			    	y: 55,
			    	floating: true,
			    	backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			    },
/*			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					},
					pointStart: timeToDate($scope.newTime)
				}
			},*/
			series: [{
				name: 'Cloud Cover',
				type: 'spline',
				yAxis: 1,
				data: $scope.historicCloudCover,
				tooltip: {
					valueSuffix: ' %'
				}

			}, {
				name: 'Humidity',
				type: 'spline',
				yAxis: 2,
				data: $scope.historicHumidity,
				marker: {
					enabled: false
				},
				dashStyle: 'shortdot',
				tooltip: {
					valueSuffix: ' %'
				}

			}, {
				name: 'Temperature',
				type: 'spline',
				data: $scope.historicTemp,
				tooltip: {
					valueSuffix: ' °C'
				}
			}]
		});
	}

	function generateArray(data,arr,value){
		switch(value){
			case 'temperature':
			for(var i=0; i<data.length; i++){
				arr.push([data[i].time*1000,data[i].temperature]);
			}
			break;
			case 'cloud_cover':
			for(var i=0; i<data.length; i++){
				arr.push([data[i].time*1000,data[i].cloudCover*100]);
			}
			break;
			case 'humidity':
			for(var i=0; i<data.length; i++){
				arr.push([data[i].time*1000,data[i].humidity*100]);
			}
			break;
		}
		return arr;
	}


}]);
