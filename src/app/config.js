/* global angular */

const app = angular.module('app', [
    'ngRoute'
]);

((app) => {
    app.config(($routeProvider) =>
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardController'
            })
            .when('/movies', {
                templateUrl: 'views/movies.html',
                controller: 'MoviesController'
            })
            .when('/movies/page/:pager', {
                templateUrl: 'views/movies.html',
                controller: 'MoviesController'
            })
            .otherwise({
                redirectTo: '/'
            })
    );
})(app);