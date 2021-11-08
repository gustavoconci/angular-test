/* global app */

((app) => {
    app.controller('MoviesController', ($scope, $http, $routeParams, $route) => {
        let movies = [];

        $scope.id = 'movies';

        $scope.movies = [];
        $scope.years = [];
        $scope.page = Number($routeParams.pager) || 1;
        $scope.pageSize = 15;
        $scope.pagination = [];
        $scope.paginationParams = '';

        $scope.filter = Object.assign({}, $routeParams);
        delete $scope.filter.pager;

        $scope.paginate = (array, page_number) => {
            if (typeof array === typeof undefined) {
                return;
            }

            return array.slice((page_number - 1) * $scope.pageSize, page_number * $scope.pageSize);
        };

        $scope.filterBy = () => {
            const paginationParams = Object.assign({}, $routeParams);
            delete paginationParams.pager;

            $scope.movies = movies;

            Object.keys($scope.filter).forEach((filter) => {
                if (typeof $scope.filter[filter] !== typeof undefined && $scope.filter[filter]) {
                    $scope.movies = $scope.movies.filter((m) => m[filter] == $scope.filter[filter]);
                }
            });

            if (JSON.stringify(paginationParams) !== JSON.stringify($scope.filter)) {
                $route.updateParams(Object.assign({ pager: 1 }, $scope.filter));
            }

            $scope.paginationParams = '?' + (new URLSearchParams($scope.filter).toString());

            loadPagination();
        };

        const loadPagination = () => {
            const pagers = [];
            const limit = Math.ceil($scope.movies.length / $scope.pageSize);
            let i = 0;

            while (++i <= limit) {
                pagers.push(i);
            }

            $scope.pagination = pagers;
        };

        $http.get('movies.json').then((data) => {
            const years = [];

            movies = data.data;

            movies.forEach((movie) => {
                if (typeof years.find((m) => (m.year === movie.year)) === typeof undefined) {
                    years.push({
                        year: movie.year
                    });
                }
            });
            
            $scope.movies = movies;
            $scope.years = years;

            $scope.filterBy();

        }, (error) => console.error(error));
    });
})(app);