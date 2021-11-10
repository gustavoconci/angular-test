describe('MoviesController', () => {
    beforeEach(module('app'));

    let $controller, $rootScope, $httpBackend, $scope;

    const movies = [
        {
            "year": 1980,
            "title": "Can't Stop the Music",
            "studios": "Associated Film Distribution",
            "producers": "Allan Carr",
            "winner": true
        },
        {
            "year": 1980,
            "title": "Cruising",
            "studios": "Lorimar Productions, United Artists",
            "producers": "Jerry Weintraub",
            "winner": false
        },
        {
            "year": 1981,
            "title": "Endless Love",
            "studios": "Universal Studios, PolyGram",
            "producers": "Dyson Lovell",
            "winner": false
        },
        {
          "year": 1990,
          "title": "The Adventures of Ford Fairlane",
          "studios": "20th Century Fox",
          "producers": "Steven Perry, Joel Silver",
          "winner": true
        },
        {
          "year": 1991,
          "title": "Hudson Hawk",
          "studios": "TriStar Pictures",
          "producers": "Joel Silver",
          "winner": true
        }
    ];

    beforeEach(inject((_$controller_, _$rootScope_, _$httpBackend_) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        $httpBackend.expectGET('movies.json').respond(200, movies);
        $httpBackend.expectGET('views/dashboard.html').respond(200,{});

        $scope = $rootScope.$new();
        $controller('MoviesController', { $scope: $scope });
        spyOn($scope.$new(), 'http');

        $httpBackend.flush();
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('$scope.years', () =>
        it('should "Search by year" contains 4 years', () =>
            expect($scope.years.length).toEqual(4)
        )
    );

    describe('$scope.filter.year = "1980"', () =>
        it('should result contains 2 movies', () => {
            $scope.filter = { year: '1980' };
            $scope.filterBy();

            expect($scope.movies.length).toEqual(2);
        })
    );

    describe('$scope.filter.winner = 1', () =>
        it('should result contains 3 movies', () => {
            $scope.filter = { winner: 1 };
            $scope.filterBy();

            expect($scope.movies.length).toEqual(3);
        })
    );

    describe('$scope.filter.year = "1980" and winner = 1', () =>
        it('should result contains 1 movie', () => {
            $scope.filter = { year: '1980', winner: 1 };
            $scope.filterBy();

            expect($scope.movies.length).toEqual(1);
        })
    );
});