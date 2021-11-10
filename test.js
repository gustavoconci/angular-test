"use strict";

describe('DashboardController', function () {
  beforeEach(module('app'));
  var $controller, $rootScope, $httpBackend, $scope;
  var movies = [{
    "year": 1980,
    "title": "Can't Stop the Music",
    "studios": "Associated Film Distribution",
    "producers": "Allan Carr",
    "winner": true
  }, {
    "year": 1980,
    "title": "Cruising",
    "studios": "Lorimar Productions, United Artists",
    "producers": "Jerry Weintraub",
    "winner": false
  }, {
    "year": 1981,
    "title": "Endless Love",
    "studios": "Universal Studios, PolyGram",
    "producers": "Dyson Lovell",
    "winner": false
  }, {
    "year": 1990,
    "title": "The Adventures of Ford Fairlane",
    "studios": "20th Century Fox",
    "producers": "Steven Perry, Joel Silver",
    "winner": true
  }, {
    "year": 1991,
    "title": "Hudson Hawk",
    "studios": "TriStar Pictures",
    "producers": "Joel Silver",
    "winner": true
  }];
  beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('movies.json').respond(200, movies);
    $httpBackend.expectGET('views/dashboard.html').respond(200, {});
    $scope = $rootScope.$new();
    $controller('DashboardController', {
      $scope: $scope
    });
    spyOn($scope.$new(), 'http');
    $httpBackend.flush();
  }));
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  describe('$scope.years', function () {
    return it('should "List years with multiple winners" length be equal 3', function () {
      return expect($scope.years.length).toEqual(3);
    });
  });
  describe('$scope.studios', function () {
    return it('should "Top 3 studios with winners" length be equal 3', function () {
      return expect($scope.studios.length).toEqual(3);
    });
  });
  describe('$scope.producersLongest', function () {
    return it('should producer longest name by "Joel Silver"', function () {
      return expect($scope.producersLongest.name).toEqual('Joel Silver');
    });
  });
  describe('$scope.search.year = "1980"', function () {
    return it('should "List movie winners by year" contains 1 movie', function () {
      $scope.search = {
        year: '1980'
      };
      $scope.searchByYear(new Event('submit'));
      expect($scope.search.result.length).toEqual(1);
    });
  });
});
"use strict";

describe('MoviesController', function () {
  beforeEach(module('app'));
  var $controller, $rootScope, $httpBackend, $scope;
  var movies = [{
    "year": 1980,
    "title": "Can't Stop the Music",
    "studios": "Associated Film Distribution",
    "producers": "Allan Carr",
    "winner": true
  }, {
    "year": 1980,
    "title": "Cruising",
    "studios": "Lorimar Productions, United Artists",
    "producers": "Jerry Weintraub",
    "winner": false
  }, {
    "year": 1981,
    "title": "Endless Love",
    "studios": "Universal Studios, PolyGram",
    "producers": "Dyson Lovell",
    "winner": false
  }, {
    "year": 1990,
    "title": "The Adventures of Ford Fairlane",
    "studios": "20th Century Fox",
    "producers": "Steven Perry, Joel Silver",
    "winner": true
  }, {
    "year": 1991,
    "title": "Hudson Hawk",
    "studios": "TriStar Pictures",
    "producers": "Joel Silver",
    "winner": true
  }];
  beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('movies.json').respond(200, movies);
    $httpBackend.expectGET('views/dashboard.html').respond(200, {});
    $scope = $rootScope.$new();
    $controller('MoviesController', {
      $scope: $scope
    });
    spyOn($scope.$new(), 'http');
    $httpBackend.flush();
  }));
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  describe('$scope.years', function () {
    return it('should "Search by year" contains 4 years', function () {
      return expect($scope.years.length).toEqual(4);
    });
  });
  describe('$scope.filter.year = "1980"', function () {
    return it('should result contains 2 movies', function () {
      $scope.filter = {
        year: '1980'
      };
      $scope.filterBy();
      expect($scope.movies.length).toEqual(2);
    });
  });
  describe('$scope.filter.winner = 1', function () {
    return it('should result contains 3 movies', function () {
      $scope.filter = {
        winner: 1
      };
      $scope.filterBy();
      expect($scope.movies.length).toEqual(3);
    });
  });
  describe('$scope.filter.year = "1980" and winner = 1', function () {
    return it('should result contains 1 movie', function () {
      $scope.filter = {
        year: '1980',
        winner: 1
      };
      $scope.filterBy();
      expect($scope.movies.length).toEqual(1);
    });
  });
});