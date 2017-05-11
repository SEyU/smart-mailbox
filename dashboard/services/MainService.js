app.service('MainService', ['$http', function ($http) {

var urlBase = 'http://localhost:8000';

    this.getCorreo = function () {

        return $http.get(urlBase+'/letter', {

            headers: {
                
                'X-Api-Key':'test api key',
            }
        });
    };
    
    this.getRecogidas = function () {

        return $http.get(urlBase+'/door', {

            headers: {
                
                'X-Api-Key':'test api key',
            }
        });
    };

    this.getTemp = function (id) {

        return $http.get(urlBase + '/measures', {

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
    };
}]);