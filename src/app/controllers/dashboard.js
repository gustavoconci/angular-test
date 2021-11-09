/* global app */

((app) => {
    const years = [];
    const studios = [];

    let producers = [];

    /**
     * Counts years with more winners.
     * @param {Object} movie 
     */
    const yearWinnerCount = (movie) => {
        /**
         * Checks the year exists in array and count the winners.
         * @param {Object} year 
         * @returns year
         */
        const findYear = (year) => {
            if (year.year === movie.year) {
                year.count += 1;

                return year;
            }
        };

        if (typeof years.find(findYear) === typeof undefined) {
            years.push({
                year: movie.year,
                count: 1
            });
        }
    };

    /**
     * Counts studios with more winners.
     * @param {Object} movie 
     */
    const studioWinnerCount = (movie) => {
        /**
         * Checks the studio exists in array and count the winners.
         * @param {Object} studio 
         * @returns studio
         */
        const findStudio = (studio) => {
            if (movie.studios.indexOf(studio.name) >= 0) {
                studio.count += 1;

                return studio;
            }
        };

        /**
         * Adds the studio in array.
         * @param {String} studio 
         */
        const eachStudio = (studio) => {
            studios.push({
                name: studio.trim(),
                count: 1
            });
        };

        if (typeof studios.find(findStudio) === typeof undefined) {
            if (typeof movie.studios === 'string') {
                movie.studios.split(',').forEach(eachStudio);
            } else {
                movie.studios.forEach(eachStudio);
            }
        }
    };

    /**
     * Calculates each producer's winning interval.
     * @param {Object} movie 
     */
    const producerWinnerInterval = (movie) => {
        /**
         * Checks the producer exists in array, calculates the interval and defines the last year.
         * @param {Object} producer 
         * @returns producer
         */
        const findProducer = (producer) => {
            if (movie.producers.indexOf(producer.name) >= 0) {
                producer.interval = Number(movie.year) - Number(producer.yearFirst);
                producer.yearLast = movie.year;

                return producer;
            }
        };

        /**
         * Adds the producer in array.
         * @param {String} producer 
         */
        const eachProducer = (producer) => {
            producers.push({
                name: producer.trim(),
                interval: 0,
                yearFirst: movie.year,
                yearLast: movie.year
            });
        };

        if (typeof producers.find(findProducer) === typeof undefined) {
            if (typeof movie.producers === 'string') {
                movie.producers.split(',').forEach(eachProducer);
            } else {
                movie.producers.forEach(eachProducer);
            }
        }
    };

    app.controller('DashboardController', ($scope, $route, $http) => {
        /**
         * Searchs movies by year.
         * @param {Event} e 
         */
        const searchByYear = (e) => {
            e.preventDefault();

            $scope.search.result = $scope.movies.filter((m) => m.year == $scope.search.year);
        };

        /**
         * Filters movies and returns only winning movies.
         * @param {Object} movie 
         * @returns movie
         */
        const filterMovies = (movie) => {
            if (movie.winner !== false) {
                yearWinnerCount(movie);
                studioWinnerCount(movie);
                producerWinnerInterval(movie);

                return movie;
            }
        };

        $scope.id = 'dashboard';
        $scope.years = [];
        $scope.studios = [];
        $scope.producers = [];
        $scope.producersLongest = {};
        $scope.producersShortest = {};
        $scope.movies = [];
        $scope.search = {};

        // Used to ng-repeat years filter.
        $scope.moreThanOne = (item) => item.count > 1;

        $scope.searchByYear = searchByYear;

        $http.get('movies.json').then((data) => {
            const movies = data.data;

            $scope.movies = movies.filter(filterMovies);

            $scope.years = years;

            // Filters producers with interval above 0.
            producers = producers.filter((p) => (p.interval > 0));
            // Sorts producers in descending order by interval.
            producers.sort((a, b) => (a.interval < b.interval) - (a.interval > b.interval));

            // Sorts studios in descending order by count.
            $scope.studios = studios.sort((a, b) => (a.count < b.count) - (a.count > b.count)).slice(0, 3);

            // Get the longest producer.
            $scope.producersLongest = producers[0];
            // Get the shortest producer.
            $scope.producersShortest = producers[producers.length - 1];
        }, (error) => console.error(error));
    });
})(app);