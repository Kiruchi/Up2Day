'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute'
])
    .controller('mainController', function($scope, $http) {

    $scope.newsLoaded = 0;

    $http.get("http://api.nytimes.com/svc/topstories/v1/world.json?api-key=bd2d6bbcb9d4b9a89adbd70f5b888ef2:0:74097087")
        .then(function onSuccess(response) {
            $scope.newsLoaded = 1;
            $scope.topArticles = response.data.results;
        }, function onFailure(response) {
            $scope.newsLoaded = 2;
        });
});