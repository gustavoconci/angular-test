/* global angular */

var app = angular.module('app', [
    'ngRoute'
]);

(function(app) {
    'use strict';

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardController'
            })
            .when('/movies', {
                templateUrl: 'views/movies.html',
                controller: 'MoviesController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(app);