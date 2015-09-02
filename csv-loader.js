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
		rawData = csv;
	};

	$scope.cleanRaw = function () {
		for (elem in $scope.structure) {
			var cor = $scope.structure[elem].correlate;
			$scope.columns.indexOf(cor);
		};
		rawData.map(function (rowVals, rowNum) {
			console.log("index", index);
			console.log("row", row);
		})
	};


});





