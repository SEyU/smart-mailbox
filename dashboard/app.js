var app = angular.module("AppPrincipal", ["ngRoute","googlechart"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            controller: "HomeCtrl",
            templateUrl: "views/home.html"
        })
});