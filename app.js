/*
https://www.telerik.com/blogs/angular-basics-using-router-angular-12-navigate-views
https://jeanpaulwebb.medium.com/angular-teste-unit%C3%A1rio-6d1224e79402
*/

var app = angular.module('app', [
    'ngRoute'
]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/movies', {
            templateUrl: 'pages/movies.html',
            controller: 'MoviesController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('DashboardController', function ($scope) {
    $scope.title = 'Dashboard';
});

app.controller('MoviesController', function ($scope, $http) {
    this.title = 'Movies';

    // $scope.fotos = [];
    // $scope.filtro = '';

    // $http.get('v1/fotos').success(function(fotos) {
    //     $scope.fotos = fotos;
    // }).error(function(erro) {
    //     console.log(erro);
    // });
});