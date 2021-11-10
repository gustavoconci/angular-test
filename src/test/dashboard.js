describe('DashboardController', () => {
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
        $controller('DashboardController', { $scope: $scope });
        spyOn($scope.$new(), 'http');

        $httpBackend.flush();
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('$scope.years', () =>
        it('should "List years with multiple winners" length be equal 3', () =>
            expect($scope.years.length).toEqual(3)
        )
    );

    describe('$scope.studios', () =>
        it('should "Top 3 studios with winners" length be equal 3', () =>
            expect($scope.studios.length).toEqual(3)
        )
    );

    describe('$scope.producersLongest', () =>
        it('should producer longest name by "Joel Silver"', () =>
            expect($scope.producersLongest.name).toEqual('Joel Silver')
        )
    );

    describe('$scope.search.year = "1980"', () =>
        it('should "List movie winners by year" contains 1 movie', () => {
            $scope.search = { year: '1980' };
            $scope.searchByYear(new Event('submit'));

            expect($scope.search.result.length).toEqual(1);
        })
    );
});