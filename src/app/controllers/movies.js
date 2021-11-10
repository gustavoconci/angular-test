/* global app */

((app) => {
    app.controller('MoviesController', ($scope, $http, $routeParams, $route) => {
        const years = [];
    
        let movies = [];

        /**
         * Creates the pagination.
         */
        const pagination = () => {
            const pagers = [];
            const limit = Math.ceil($scope.movies.length / $scope.pageSize);
            let i = 0;

            while (++i <= limit) {
                pagers.push(i);
            }

            $scope.pagination = pagers;
        };

        /**
         * Returns items from current page.
         * @param {Array} array 
         * @param {Number} page_number 
         * @returns array
         */
        const paginate = (array, page_number) => {
            if (typeof array === typeof undefined) {
                return;
            }

            return array.slice((page_number - 1) * $scope.pageSize, page_number * $scope.pageSize);
        };

        /**
         * Filters the movies.
         */
        const filterBy = () => {
            // Filter params used to the pagination.
            const paginationParams = Object.assign({}, $routeParams);
            delete paginationParams.pager;

            $scope.movies = movies;

            // Apply the filters.
            Object.keys($scope.filter).forEach((filter) => {
                if (typeof $scope.filter[filter] !== typeof undefined && $scope.filter[filter]) {
                    $scope.movies = $scope.movies.filter((m) => m[filter] == $scope.filter[filter]);
                }
            });

            // Checks if the filter params have changed.
            if (JSON.stringify(paginationParams) !== JSON.stringify($scope.filter)) {
                $route.updateParams(Object.assign({ pager: 1 }, $scope.filter));
            }

            $scope.paginationParams = '?' + (new URLSearchParams($scope.filter).toString());

            pagination();
        };

        /**
         * Add year to array that has not been added.
         * @param {Object} movie
         */
        const eachYear = (movie) => {
            if (typeof years.find((m) => (m.year === movie.year)) === typeof undefined) {
                years.push({
                    year: movie.year
                });
            }
        };

        $scope.id = 'movies';
        $scope.movies = [];
        $scope.years = [];
        $scope.page = Number($routeParams.pager) || 1;
        $scope.pageSize = 15;
        $scope.pagination = [];
        $scope.paginationParams = '';

        // Filter params used to the pagination.
        $scope.filter = Object.assign({}, $routeParams);
        delete $scope.filter.pager;

        $scope.paginate = paginate;
        $scope.filterBy = filterBy;

        $scope.http = $http.get('movies.json').then((data) => {
            movies = data.data;

            $scope.movies = movies;

            // Used to filter by year.
            movies.forEach(eachYear);
            $scope.years = years;

            $scope.filterBy();

        }, (error) => console.error(error));
    });
})(app);