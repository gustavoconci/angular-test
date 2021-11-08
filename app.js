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
        return m.year == $scope.search.year;
      });
    };

    $http.get('movies.json').then(function (data) {
      var movies = data.data;
      var years = [];
      var studios = [];
      var producers = [];

      var yearWinnerCount = function yearWinnerCount(movie) {
        if (_typeof(years.find(function (m) {
          if (m.year === movie.year) {
            m.count += 1;
            return m;
          }
        })) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
          years.push({
            year: movie.year,
            count: 1
          });
        }
      };

      var studioWinnerCount = function studioWinnerCount(movie) {
        if (_typeof(studios.find(function (s) {
          if (movie.studios.indexOf(s.name) >= 0) {
            s.count += 1;
            return s;
          }
        })) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
          movie.studios.split(',').forEach(function (studio) {
            studios.push({
              name: studio.trim(),
              count: 1
            });
          });
        }
      };

      var producerWinnerInterval = function producerWinnerInterval(movie) {
        if (_typeof(producers.find(function (p) {
          if (movie.producers.indexOf(p.name) >= 0) {
            p.interval = Number(movie.year) - Number(p.yearFirst); // revision

            p.yearLast = movie.year;
            return p;
          }
        })) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
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
        return p.interval > 0;
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
    var movies = [];
    $scope.id = 'movies';
    $scope.movies = [];
    $scope.years = [];
    $scope.page = Number($routeParams.pager) || 1;
    $scope.pageSize = 15;
    $scope.pagination = [];
    $scope.paginationParams = '';
    $scope.filter = Object.assign({}, $routeParams);
    delete $scope.filter.pager;

    $scope.paginate = function (array, page_number) {
      if (_typeof(array) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
        return;
      }

      return array.slice((page_number - 1) * $scope.pageSize, page_number * $scope.pageSize);
    };

    $scope.filterBy = function () {
      var paginationParams = Object.assign({}, $routeParams);
      delete paginationParams.pager;
      $scope.movies = movies;
      Object.keys($scope.filter).forEach(function (filter) {
        if (_typeof($scope.filter[filter]) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) && $scope.filter[filter]) {
          $scope.movies = $scope.movies.filter(function (m) {
            return m[filter] == $scope.filter[filter];
          });
        }
      });

      if (JSON.stringify(paginationParams) !== JSON.stringify($scope.filter)) {
        $route.updateParams(Object.assign({
          pager: 1
        }, $scope.filter));
      }

      $scope.paginationParams = '?' + new URLSearchParams($scope.filter).toString();
      loadPagination();
    };

    var loadPagination = function loadPagination() {
      var pagers = [];
      var limit = Math.ceil($scope.movies.length / $scope.pageSize);
      var i = 0;

      while (++i <= limit) {
        pagers.push(i);
      }

      $scope.pagination = pagers;
    };

    $http.get('movies.json').then(function (data) {
      var years = [];
      movies = data.data;
      movies.forEach(function (movie) {
        if (_typeof(years.find(function (m) {
          return m.year === movie.year;
        })) === (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
          years.push({
            year: movie.year
          });
        }
      });
      $scope.movies = movies;
      $scope.years = years;
      $scope.filterBy();
    }, function (error) {
      return console.error(error);
    });
  });
})(app);