/* global app */

(function(app) {
    'use strict';

    app.controller('MoviesController', function ($scope, $http) {
        var movies = [];

        $scope.id = 'movies';

        $scope.filter = {};
        $scope.filterBy = function () {
            $scope.movies = movies;

            if (typeof $scope.filter.year !== typeof undefined && $scope.filter.year) {
                $scope.filter.year = $scope.filter.year.replace(/\D/g, '');

                $scope.movies = $scope.movies.filter(function (m) {
                    if (m.year.toString().indexOf($scope.filter.year) >= 0) {
                        return m;
                    }
                });
            }
            
            if (typeof $scope.filter.winner !== typeof undefined && $scope.filter.winner) {
                $scope.movies = $scope.movies.filter(function (m) {
                    if (m.winner == $scope.filter.winner) {
                        return m;
                    }
                });
            }
        };

        $http.get('movies.json').then(
            function(data) {
                movies = data.data;
                $scope.movies = movies;

            }, function(error) {
                console.error(error);
            }
        );
    });
})(app);