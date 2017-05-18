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

    this.getTemp = function () {

        return $http.get(urlBase + '/measures', {

            headers: {
                'X-Api-Key':'test api key',
            }
        });
    };

    this.getTempNow = function () {

        return $http.get(urlBase + '/measures?limit=1', {

            headers: {
                'X-Api-Key':'test api key',
            }
        });
    };
    this.getStatus = function () {

        return $http.get(urlBase + '/mailbox', {

            headers: {
                'X-Api-Key':'test api key',
            }
        });
    };

}]);