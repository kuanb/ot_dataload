var app = angular.module('loaderApp', []);

app.controller('loadControl', function($scope) {

	var rawData = null;

	$scope.columns = null;
	$scope.structure = {
		unique_vehicle_id: {
			verbose: 'Unique Vehicle ID',
			id: 'unique_vehicle_id',
			correlate: null,
		}, utc_timestamp: {
			verbose: 'UTC Timestamp',
			id: 'utc_timestamp',
			correlate: null,
		}, lat: {
			verbose: 'Latitude',
			id: 'lat',
			correlate: null,
		}, lon: {
			verbose: 'Longitude',
			id: 'lon',
			correlate: null,
		}
	};

	$scope.allCorrelated = function () {
		var ok = true;
		for (elem in $scope.structure) {
			var cor = $scope.structure[elem].correlate;
			if (cor == null) {
				ok = false;
			}
		}
		return ok;
	}

	$scope.runLoad = function () {
		var file = document.getElementById('fileUpload');
		if (file.files.length > 0) {
			file = file.files[0];
			if (file.type == 'text/csv') {
				parseCSV(file);
			} else {
				alert('This file type is not supported');
			}
		} else {
			alert('No file selected');
		}
	};

	var parseCSV = function (file) {
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(event) {
		  var csvData = event.target.result;
		  data = $.csv.toArrays(csvData);
		  if (data && data.length > 0) {
		    runSelector(data);
		  } else {
		    alert('No data to import!');
		  }
		};
		reader.onerror = function() {
		  alert('Unable to read ' + file.fileName);
		};
	};

	var runSelector = function (csv) {
		$scope.$apply(function () {
			$scope.columns = csv[0];	
		});
		rawData = csv.splice(1, csv.length);
	};

	var guid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    	return v.toString(16);
		});
	}

	$scope.cleanRaw = function () {

		var toProcess = [];
		for (struc in $scope.structure) {
			var cor = $scope.structure[struc].correlate;
			toProcess.push({
				index: $scope.columns.indexOf(cor),
				cor: cor
			});
		}

		rawData = rawData.map(function (rowVals, rowNum) {
			var newRow = {};
			toProcess.forEach(function (item) {
				var index = item.index;
				var cor = item.cor;
				newRow[cor] = rowVals[index];
			});
			return newRow;
		});

		// {vehicleId: 123, vehicleLocation:[{lat:12.0,lon:123.0,time:1234}...]}
		var vehId = $scope.structure.unique_vehicle_id.correlate;
		var time = $scope.structure.utc_timestamp.correlate;
		var lat = $scope.structure.lat.correlate;
		var lon = $scope.structure.lon.correlate;

		var vehicles = {};
		var sorted = {};

		rawData.forEach(function (data) {
			if (data[vehId] in vehicles) {
				var uuid = vehicles[data[vehId]];
				var newPt = {
					lat: data[lat],
					lon: data[lon],
					time: data[time]
				};
				sorted[uuid].vehicleLocation.push(newPt)
			} else {
				var g = guid();
				vehicles[data[vehId]] = g;
				sorted[g] = {
					vehicleId: data[vehId],
					vehicleLocation: []
				};
			}
		})

		console.log(sorted);
	};


});





