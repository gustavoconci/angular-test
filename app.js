"use strict";

/* global angular */
var app = angular.module('app', ['ngRoute']);

(function (app) {
  app.config(function ($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController'
    }).when('/movies', {
      templateUrl: 'views/movies.html',
      controller: 'MoviesController'
    }).when('/movies/page/:pager', {
      templateUrl: 'views/movies.html',
      controller: 'MoviesController'
    }).otherwise({
      redirectTo: '/'
    });
  });
})(app);
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global app */
(function (app) {
  app.controller('DashboardController', function ($scope, $route, $http) {
    var years = [];
    var studios = [];
    var producers = [];
    /**
     * Counts years with more winners.
     * @param {Object} movie 
     */

    var yearWinnerCount = function yearWinnerCount(movie) {
      /**
       * Checks the year exists in array and count the winners.
       * @param {Object} year 
       * @returns year
       */
      var findYear = function findYear(year) {
        if (year.year === movie.year) {
          year.count += 1;
          return year;
        }
      };

      if (_typeof(years.find(findYear)) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
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


    var studioWinnerCount = function studioWinnerCount(movie) {
      /**
       * Checks the studio exists in array and count the winners.
       * @param {Object} studio 
       * @returns studio
       */
      var findStudio = function findStudio(studio) {
        if (movie.studios.indexOf(studio.name) >= 0) {
          studio.count += 1;
          return studio;
        }
      };
      /**
       * Adds the studio in array.
       * @param {String} studio 
       */


      var eachStudio = function eachStudio(studio) {
        studios.push({
          name: studio.trim(),
          count: 1
        });
      };

      if (_typeof(studios.find(findStudio)) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
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


    var producerWinnerInterval = function producerWinnerInterval(movie) {
      /**
       * Checks the producer exists in array, calculates the interval and defines the last year.
       * @param {Object} producer 
       * @returns producer
       */
      var findProducer = function findProducer(producer) {
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


      var eachProducer = function eachProducer(producer) {
        producers.push({
          name: producer.trim(),
          interval: 0,
          yearFirst: movie.year,
          yearLast: movie.year
        });
      };

      if (_typeof(producers.find(findProducer)) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
        if (typeof movie.producers === 'string') {
          movie.producers.split(',').forEach(eachProducer);
        } else {
          movie.producers.forEach(eachProducer);
        }
      }
    };
    /**
     * Searchs movies by year.
     * @param {Event} e 
     */


    var searchByYear = function searchByYear(e) {
      e.preventDefault();
      $scope.search.result = $scope.movies.filter(function (m) {
        return m.year == $scope.search.year;
      });
    };
    /**
     * Filters movies and returns only winning movies.
     * @param {Object} movie 
     * @returns movie
     */


    var filterMovies = function filterMovies(movie) {
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
    $scope.search = {}; // Used to ng-repeat years filter.

    $scope.moreThanOne = function (item) {
      return item.count > 1;
    };

    $scope.searchByYear = searchByYear;
    $http.get('movies.json').then(function (data) {
      var movies = data.data;
      $scope.movies = movies.filter(filterMovies);
      $scope.years = years; // Filters producers with interval above 0.

      producers = producers.filter(function (p) {
        return p.interval > 0;
      }); // Sorts producers in descending order by interval.

      producers.sort(function (a, b) {
        return (a.interval < b.interval) - (a.interval > b.interval);
      }); // Sorts studios in descending order by count.

      $scope.studios = studios.sort(function (a, b) {
        return (a.count < b.count) - (a.count > b.count);
      }).slice(0, 3); // Get the longest producer.

      $scope.producersLongest = producers[0]; // Get the shortest producer.

      $scope.producersShortest = producers[producers.length - 1];
    }, function (error) {
      return console.error(error);
    });
  });
})(app);
"use strict";

/* global app */
(function (app) {
  app.controller('MainController', function ($scope, $route) {
    return $scope.$route = $route;
  });
})(app);
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global app */
(function (app) {
  app.controller('MoviesController', function ($scope, $http, $routeParams, $route) {
    var years = [];
    var movies = [];
    /**
     * Creates the pagination.
     */

    var pagination = function pagination() {
      var pagers = [];
      var limit = Math.ceil($scope.movies.length / $scope.pageSize);
      var i = 0;

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


    var paginate = function paginate(array, page_number) {
      if (_typeof(array) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
        return;
      }

      return array.slice((page_number - 1) * $scope.pageSize, page_number * $scope.pageSize);
    };
    /**
     * Filters the movies.
     */


    var filterBy = function filterBy() {
      // Filter params used to the pagination.
      var paginationParams = Object.assign({}, $routeParams);
      delete paginationParams.pager;
      $scope.movies = movies; // Apply the filters.

      Object.keys($scope.filter).forEach(function (filter) {
        if (_typeof($scope.filter[filter]) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) && $scope.filter[filter]) {
          $scope.movies = $scope.movies.filter(function (m) {
            return m[filter] == $scope.filter[filter];
          });
        }
      }); // Checks if the filter params have changed.

      if (JSON.stringify(paginationParams) !== JSON.stringify($scope.filter)) {
        $route.updateParams(Object.assign({
          pager: 1
        }, $scope.filter));
      }

      $scope.paginationParams = '?' + new URLSearchParams($scope.filter).toString();
      pagination();
    };
    /**
     * Add year to array that has not been added.
     * @param {Object} movie
     */


    var eachYear = function eachYear(movie) {
      if (_typeof(years.find(function (m) {
        return m.year === movie.year;
      })) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
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
    $scope.paginationParams = ''; // Filter params used to the pagination.

    $scope.filter = Object.assign({}, $routeParams);
    delete $scope.filter.pager;
    $scope.paginate = paginate;
    $scope.filterBy = filterBy;
    $http.get('movies.json').then(function (data) {
      movies = data.data;
      $scope.movies = movies; // Used to filter by year.

      movies.forEach(eachYear);
      $scope.years = years;
      $scope.filterBy();
    }, function (error) {
      return console.error(error);
    });
  });
})(app);