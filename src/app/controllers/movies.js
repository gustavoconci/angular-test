/* global app */

(function(app) {
    'use strict';

    app.controller('MoviesController', function ($scope, $http, $routeParams) {
        var movies = [];

        $scope.id = 'movies';

        $scope.filter = {};

        $scope.page = Number($routeParams.pager) || 1;
        $scope.pageSize = 15;
        $scope.paginate = function (array, page_number) {
            if (typeof array === typeof undefined) {
                return;
            }

            return array.slice((page_number - 1) * $scope.pageSize, page_number * $scope.pageSize);
        };
        $scope.pagination = [];

        var loadPagination = function () {
            var pagers = [],
                limit = Math.ceil(movies.length / $scope.pageSize);

            for (var i = 1; i <= limit; i++) {
                pagers.push(i);
            }

            $scope.pagination = pagers;
        };

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

                loadPagination();

            }, function(error) {
                console.error(error);
            }
        );
    });
})(app);