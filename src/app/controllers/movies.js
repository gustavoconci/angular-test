/* global app */

(function(app) {
    'use strict';

    app.controller('MoviesController', function ($scope, $http, $routeParams, $route) {
        var movies = [];

        $scope.id = 'movies';

        $scope.movies = [];
        $scope.years = [];

        $scope.filter = Object.assign({}, $routeParams);
        delete $scope.filter.pager;

        $scope.page = Number($routeParams.pager) || 1;
        $scope.pageSize = 15;
        $scope.paginate = function (array, page_number) {
            if (typeof array === typeof undefined) {
                return;
            }

            return array.slice((page_number - 1) * $scope.pageSize, page_number * $scope.pageSize);
        };
        $scope.pagination = [];
        $scope.paginationParams = '';

        var loadPagination = function () {
            var pagers = [],
                limit = Math.ceil($scope.movies.length / $scope.pageSize);

            for (var i = 1; i <= limit; i++) {
                pagers.push(i);
            }

            $scope.pagination = pagers;
        };

        $scope.filterBy = function () {
            var paginationParams = Object.assign({}, $routeParams);
            delete paginationParams.pager;

            $scope.movies = movies;

            if (typeof $scope.filter.year !== typeof undefined && $scope.filter.year) {
                $scope.movies = $scope.movies.filter(function (m) {
                    if (m.year == $scope.filter.year) {
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

            if (JSON.stringify(paginationParams) !== JSON.stringify($scope.filter)) {
                $route.updateParams(Object.assign({ pager: 1 }, $scope.filter));
            }

            $scope.paginationParams = '?' + (new URLSearchParams($scope.filter).toString());

            loadPagination();
        };

        $http.get('movies.json').then(
            function(data) {
                var years = [];

                movies = data.data;

                movies.forEach(function (movie) {
                    if (typeof years.find(function (m) {
                        if (m.year === movie.year) {
                            return m;
                        }
                    }) === typeof undefined) {
                        years.push({
                            year: movie.year
                        });
                    }
                });
                
                $scope.movies = movies;
                $scope.years = years;

                $scope.filterBy();

            }, function(error) {
                console.error(error);
            }
        );
    });
})(app);