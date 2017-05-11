app.service('MainService', ['$http', function ($http) {

var urlBase = 'http://apifrasco.manelme.com/';

    this.getCorreo = function () {

        return $http.get(urlBase+'/correo', {

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
    };
    
    this.getRecogidas = function () {

        return $http.get(urlBase+'/recogidas', {

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
    };

    this.getTemp = function (id) {

        return $http.get(urlBase + '/temp', {

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
    };
}]);