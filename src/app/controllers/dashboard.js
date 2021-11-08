/* global app */

((app) => {
    app.controller('DashboardController', ($scope, $route, $http) => {
        $scope.id = 'dashboard';

        $scope.years = [];
        $scope.studios = [];
        $scope.producers = [];
        $scope.producersLongest = {};
        $scope.producersShortest = {};
        $scope.movies = [];
        $scope.search = {};

        $scope.moreThanOne = (item) => item.count > 1;

        $scope.searchByYear = (e) => {
            e.preventDefault();

            $scope.search.result = $scope.movies.filter((m) => m.year == $scope.search.year);
        };

        $http.get('movies.json').then((data) => {
            const movies = data.data;
            const years = [];
            const studios = [];

            let producers = [];

            const yearWinnerCount = (movie) => {
                if (typeof years.find((m) => {
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

            const studioWinnerCount = (movie) => {
                if (typeof studios.find((s) => {
                    if (movie.studios.indexOf(s.name) >= 0) {
                        s.count += 1;

                        return s;
                    }
                }) === typeof undefined) {
                    movie.studios.split(',').forEach((studio) => {
                        studios.push({
                            name: studio.trim(),
                            count: 1
                        });
                    });
                }
            };

            const producerWinnerInterval = (movie) => {
                if (typeof producers.find((p) => {
                    if (movie.producers.indexOf(p.name) >= 0) {
                        p.interval = Number(movie.year) - Number(p.yearFirst); // revision
                        p.yearLast = movie.year;

                        return p;
                    }
                }) === typeof undefined) {
                    movie.producers.split(',').forEach((producer) => {
                        producers.push({
                            name: producer.trim(),
                            interval: 0,
                            yearFirst: movie.year,
                            yearLast: movie.year
                        });
                    });
                }
            };

            $scope.movies = movies.filter((movie) => {
                if (movie.winner !== false) {
                    yearWinnerCount(movie);
                    studioWinnerCount(movie);
                    producerWinnerInterval(movie);

                    return movie;
                }
            });

            producers = producers.filter((p) => (p.interval > 0));
            producers.sort((a, b) => (a.interval < b.interval) - (a.interval > b.interval));

            $scope.years = years;

            $scope.studios = studios.sort((a, b) => (a.count < b.count) - (a.count > b.count)).slice(0, 3);

            $scope.producersLongest = producers[0];
            $scope.producersShortest = producers[producers.length - 1];
        }, (error) => console.error(error));
    });
})(app);