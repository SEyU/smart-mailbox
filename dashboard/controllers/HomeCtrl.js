app.controller("HomeCtrl", ['$scope', '$routeParams', '$route', 'MainService', function ($scope, $routeParams, $route, MainService) {

    $('.dropdown-toggle').dropdown();
    $scope.imgURI = 'img/placeholderFoto.jpg';

    $scope.barraDeCarga = true;

    var dia = new Date();
    var correos;
    var recogidas;
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Augosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var temeraturas;
    $scope.dineroEnCaja = 0;

    $scope.ejemploGrafica = function () {
        google.charts.load("current", { packages: ["calendar"] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
            dataTable.addRows([
                [new Date(2012, 3, 13), 37032],
                [new Date(2012, 3, 14), 38024],
                [new Date(2012, 3, 15), 38024],
                [new Date(2012, 3, 16), 38108],
                [new Date(2012, 3, 17), 38229],
                // Many rows omitted for brevity.
                [new Date(2013, 9, 4), 38177],
                [new Date(2013, 9, 5), 38705],
                [new Date(2013, 9, 12), 38210],
                [new Date(2013, 9, 13), 38029],
                [new Date(2013, 9, 19), 38823],
                [new Date(2013, 9, 23), 38345],
                [new Date(2013, 9, 24), 38436],
                [new Date(2013, 9, 30), 38447]
            ]);

            var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

            var options = {
                title: "Red Sox Attendance",
                height: 350,
            };

            chart.draw(dataTable, options);
        }
    };

    $scope.myChartObject = {};
    $scope.myChartObject.type = "Gauge";

    $scope.myChartObject.options = {
        redFrom: 90,
        redTo: 100,
        yellowFrom: 75,
        yellowTo: 90,
        minorTicks: 5
    };

    $scope.myChartObject.data = [
        ['Label', 'Value'],
        ['Temperatura', 80],
        ['Humedad', 55]
    ];
    var graficaTemperaturas = function () {

    };

    var graficaCorreos = function () {

    };

    var graficaRecogidas = function () {

    };

    $scope.cargarResumen = function () {

        MainService.getCorreo.then(function (response) {

            correos = response.data;

            //graficaCorreos();

            MainService.getRecogidas().then(function (response) {

                temeraturas = response.data;

                //graficaTemperaturas();

                $scope.barraDeCarga = false;

            }, function (error) {

                window.alert(error.message);

            });

            MainService.getRecogidas().then(function (response) {

                recogidas = response.data;


            }, function (error) {

                window.alert(error.message)
            });

        }, function (error) {

            window.alert(error.message);
        });
    }
}]);