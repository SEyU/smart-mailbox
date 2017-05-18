app.controller("HomeCtrl", ['$scope','$interval', '$routeParams', '$route', 'MainService', function ($scope, $interval, $routeParams, $route, MainService) {

    $('.dropdown-toggle').dropdown();
    
    $scope.time = new Date().toLocaleTimeString();
    $scope.estado = 0;
    var hoy = $interval(function(){
       $scope.time = new Date().toLocaleTimeString();
       MainService.getStatus().then(function (response) {

            $scope.estado = response.data.count;


        }, function (error) {

            
        });
        MainService.getTempNow().then(function (response2) {

            $scope.tempNow = response2.data[0].temp;
            $scope.humNow = response2.data[0].hum;


        }, function (error) {

            
        });
        
    },1000);

    var correos;
    var recogidas;
    var temperaturas;
    var temperaturaNow;
    var status;
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Augosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    


    var graficaTemperaturas = function () {

      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var tempData = [];
        var auxNum=-1;
        
        for(var i=0;i<temperaturas.length;i++){
            var auxDate = new Date(temperaturas[i].ocurredOn);
            
            if(auxDate.getMonth() == new Date().getMonth() && auxDate.getFullYear() == new Date().getFullYear()){
                if(tempData.length == 0){
                    tempData[tempData.length] = {"dia": auxDate.getDate(), "tempMax":temperaturas[i].temp, "tempMin":temperaturas[i].temp,"humMax":temperaturas[i].hum};
                } 
                
                tempData.forEach(function(element) {
                    if(element.dia == auxDate.getDate()){
                        auxNum = element.dia;
                        if(element.tempMax < temperaturas[i].temp){
                            element.tempMax = temperaturas[i].temp;
                        }
                        if(element.tempMin > temperaturas[i].temp){
                            element.tempMin = temperaturas[i].temp;
                        }
                        if(element.humMax < temperaturas[i].hum){
                            element.humMax = temperaturas[i].hum;
                        }
                    }

                }, this);
                if(auxNum == -1){
                    tempData[tempData.length] = {"dia": auxDate.getDate(), "tempMax":temperaturas[i].temp, "tempMin":temperaturas[i].temp,"humMax":temperaturas[i].hum};
                }else{
                    auxNum = -1;
                }
                
            }
        }
        tempData = tempData.reverse();
        
        var datos = [['Dia', 'Temp. Max', 'Temp. Min']];
        var datos2 = [['Dia', 'Hum. Max']];
        

          
        tempData.forEach(function(element) {

            datos.push([Number(element.dia), Number(element.tempMax), Number(element.tempMin)]);        
            datos2.push([Number(element.dia), Number(element.humMax)]);
        }, this);

        
        var data = google.visualization.arrayToDataTable(datos);
        var data2 = google.visualization.arrayToDataTable(datos2);


        var options = {
          title: 'Temperatura de '+ monthNames[new Date().getMonth()],
          curveType: 'function',
          legend: { position: 'bottom' },
          backgroundColor: { fill:'transparent' }
        };

        var options2 = {
          title: 'Humedad de '+ monthNames[new Date().getMonth()],
          curveType: 'function',
          legend: { position: 'bottom' },
          backgroundColor: { fill:'transparent' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        var chart2 = new google.visualization.LineChart(document.getElementById('curve_chart2'));

        chart.draw(data, options);
        chart2.draw(data2, options2);
      }
         
    };

    var graficaCorreos = function () {
        google.charts.load("current", { packages: ["calendar", "gauge","corechart"] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var dataTable = new google.visualization.DataTable();
            var correosData = [];
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
            var numero = 0;
            var auxNum=0;
            var auxDate = new Date(correos[0].ocurredOn);
            for(var i=0;i<correos.length;i++){
                var auxDate2 = new Date(correos[i].ocurredOn);
                if(auxDate2.toDateString()==auxDate.toDateString()){
                    auxNum = auxNum+1;
                }else{
                    correosData[numero] = [auxDate, auxNum];
                    numero++;
                    auxDate = new Date(correos[i].ocurredOn);
                    auxNum = 1;
                }
            }

            correosData[numero] = [auxDate,auxNum];
            dataTable.addRows(
                correosData
            );

            var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

            var options = {
                title: "Correos Recibidos",
                calendar: {
                    yearLabel: {
                        color: 'grey',
                    },
                    cellSize: 14,
                },
                

            };

            chart.draw(dataTable, options);
        }
    };

    var graficaRecogidas = function () {

    };

    $scope.reload = function (){

        window.location.reload();
    };

    $scope.cargarResumen = function () {
        
        MainService.getTempNow().then(function (response2) {

            $scope.tempNow = response2.data[0].temp;
            $scope.humNow = response2.data[0].hum;


        }, function (error) {

            
        });
        MainService.getStatus().then(function (response) {

            $scope.estado = response.data.count;

        }, function (error) {

            
        });
        MainService.getCorreo().then(function (response) {

            correos = response.data;
            graficaCorreos();

            MainService.getRecogidas().then(function (response) {

                recogidas = response.data;
                graficaRecogidas();

            }, function (error) {

                

            });

            MainService.getTemp().then(function (response) {

                temperaturas = response.data;
                graficaTemperaturas();

            }, function (error) {

                
            });

        }, function (error) {

            
        });
    }
}]);