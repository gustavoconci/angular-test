/* global app */

((app) => {
    app.controller('MainController', ($scope, $route) => 
        $scope.$route = $route
    );
})(app);