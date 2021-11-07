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
            .when('/movies/page/:pager', {
                templateUrl: 'views/movies.html',
                controller: 'MoviesController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})(app);
/* global app */

(function(app) {
    'use strict';

    app.controller('DashboardController', function ($scope, $route, $http) {
        $scope.id = 'dashboard';

        $scope.years = [];
        $scope.studios = [];
        $scope.producers = [];
        $scope.producersLongest = {};
        $scope.producersShortest = {};
        $scope.movies = [];
        $scope.search = {};

        $scope.moreThanOne = function (item) {
            return item.count > 1;
        };

        $scope.searchByYear = function (e) {
            e.preventDefault();

            $scope.search.result = $scope.movies.filter(function (m) {
                if (m.year == $scope.search.year) {
                    return m;
                }
            });
        };

        $http.get('movies.json').then(
            function(data) {
                var movies = data.data,
                    years = [],
                    studios = [],
                    producers = [];

                var yearWinnerCount = function (movie) {
                    if (typeof years.find(function (m) {
                        if (m.year === movie.year) {
                            m.count += 1;

                            return m;
                        }
                    }) === typeof undefined) {
                        years.push({
                            year: movie.year,
                            count: 1
                        });
                    }
                };

                var studioWinnerCount = function (movie) {
                    if (typeof studios.find(function (s) {
                        if (movie.studios.indexOf(s.name) >= 0) {
                            s.count += 1;

                            return s;
                        }
                    }) === typeof undefined) {
                        movie.studios.split(',').forEach(function (studio) {
                            studios.push({
                                name: studio.trim(),
                                count: 1
                            });
                        });
                    }
                };

                var producerWinnerInterval = function (movie) {
                    if (typeof producers.find(function (p) {
                        if (movie.producers.indexOf(p.name) >= 0) {
                            p.interval = Number(movie.year) - Number(p.yearFirst); // revision
                            p.yearLast = movie.year;

                            return p;
                        }
                    }) === typeof undefined) {
                        movie.producers.split(',').forEach(function (producer) {
                            producers.push({
                                name: producer.trim(),
                                interval: 0,
                                yearFirst: movie.year,
                                yearLast: movie.year
                            });
                        });
                    }
                };

                $scope.movies = movies.filter(function (movie) {
                    if (movie.winner !== false) {
                        yearWinnerCount(movie);
                        studioWinnerCount(movie);
                        producerWinnerInterval(movie);

                        return movie;
                    }
                });

                producers = producers.filter(function (p) {
                    if (p.interval > 0) {
                        return p;
                    }
                });
                producers.sort(function (a, b) {
                    return (a.interval < b.interval) - (a.interval > b.interval);
                });

                $scope.years = years;

                $scope.studios = studios.sort(function (a, b) {
                    return (a.count < b.count) - (a.count > b.count);
                }).slice(0, 3);

                $scope.producersLongest = producers[0];
                $scope.producersShortest = producers[producers.length - 1];
            }, function(error) {
                console.error(error);
            }
        );
    });
})(app);
/* global app */

(function(app) {
    'use strict';

    app.controller('MainController', function($scope, $route) {
        $scope.$route = $route;
    });
})(app);
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