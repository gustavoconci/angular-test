/* global app */

(function(app) {
    'use strict';

    app.controller('DashboardController', function ($scope, $route, $http) {
        $scope.id = 'dashboard';

        $scope.years = [];
        $scope.studios = [];
        $scope.producers = [];

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
                            p.yearLast = movie.year

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

                movies.forEach(function (movie) {
                    if (movie.winner !== 'yes') {
                        return;
                    }

                    yearWinnerCount(movie);

                    studioWinnerCount(movie);

                    producerWinnerInterval(movie);
                });

                producers = producers.filter(function (p) {
                    if (p.interval > 0) {
                        return p;
                    }
                });
                producers.sort(function (a, b) {
                    return (a.interval < b.interval) - (a.interval > b.interval);
                });

                $scope.years = years.filter(function (m) {
                    if (m.count > 1) {
                        return m;
                    }
                });

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