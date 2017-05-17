app.controller("HomeCtrl", ['$scope','$interval', '$routeParams', '$route', 'MainService', function ($scope, $interval, $routeParams, $route, MainService) {

    $('.dropdown-toggle').dropdown();
    
    $scope.time = new Date().toLocaleTimeString();
    $scope.estado = true
    var hoy = $interval(function(){
       $scope.time = new Date().toLocaleTimeString();
       MainService.getStatus().then(function (response) {

            $scope.estado = response.data.empty;

        }, function (error) {

            window.alert(error.message);
        });
        
    },1000);

    var correos;
    var recogidas;
    var temperaturas;
    var status;
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Augosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    
    $scope.barraDeCarga = true;


    var graficaTemperaturas = function () {
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                ['Memory', 80],
                ['CPU', 55],
                ['Network', 68]
            ]);

            var options = {
                width: 400, height: 120,
                redFrom: 90, redTo: 100,
                yellowFrom: 75, yellowTo: 90,
                minorTicks: 5
            };

            var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

            chart.draw(data, options);

            setInterval(function () {
                data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
                chart.draw(data, options);
            }, 13000);
            setInterval(function () {
                data.setValue(1, 1, 40 + Math.round(60 * Math.random()));
                chart.draw(data, options);
            }, 5000);
            setInterval(function () {
                data.setValue(2, 1, 60 + Math.round(20 * Math.random()));
                chart.draw(data, options);
            }, 26000);
        }
    };

    var graficaCorreos = function () {
        google.charts.load("current", { packages: ["calendar", "gauge"] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var dataTable = new google.visualization.DataTable();
            var correosData = {};
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
            var auxNum=0;
            var auxDate = new Date(correos[0].ocurredOn);
            for(var i=0;i<correos.length;i++){
                var auxDate2 = new Date(correos[i].ocurredOn);
                if(auxDate2.toDateString()==auxDate.toDateString()){
                    auxNum = auxNum+1;
                }else{
                    correosData[auxDate] = auxNum;
                    auxDate = new Date(correos[i].ocurredOn);
                    auxNum = 1;
                }
            }
            correosData[auxDate] = auxNum;
            window.alert(correosData[auxDate]);
            dataTable.addRows([
                [new Date(2012, 3, 13), 10],
                [new Date(2012, 3, 14), 1],
                [new Date(2012, 3, 15), 3],
                [new Date(2012, 3, 16), 5],
                [new Date(2012, 3, 17), 7],
            ]);

            var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

            var options = {
                title: "Red Sox Attendance",
                calendar: {
                    yearLabel: {
                        color: 'white',
                    }
                },

            };

            chart.draw(dataTable, options);
        }
    };

    var graficaRecogidas = function () {

    };

    $scope.cargarResumen = function () {
        
        MainService.getStatus().then(function (response) {

            $scope.estado = response.data.empty;

        }, function (error) {

            window.alert(error.message);
        });
        MainService.getCorreo().then(function (response) {

            correos = response.data;
            graficaCorreos();

            MainService.getRecogidas().then(function (response) {

                recogidas = response.data;
                graficaRecogidas();

            }, function (error) {

                window.alert(error.message);

            });

            MainService.getTemp().then(function (response) {

                temperaturas = response.data;
                graficaTemperaturas();

            }, function (error) {

                window.alert(error.message)
            });

        }, function (error) {

            window.alert(error.message);
        });
    }
}]);