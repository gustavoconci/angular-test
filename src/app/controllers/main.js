/* global app */

(function(app) {
    'use strict';

    app.controller('MainController', function($scope, $route) {
        $scope.$route = $route;
    });
})(app);