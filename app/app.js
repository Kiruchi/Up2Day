'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'ui.bootstrap'
    ])
    .controller('mainController', function ($scope, $http) {

        // Find geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.$apply(function () {
                    $scope.position = position;
                    console.log($scope.position);

                    // Load weather
                    $scope.city = null;
                    $scope.weather = null;

                    $http.get("http://api.openweathermap.org/data/2.5/weather?APPID=929a9d959a9525b0119016c485eef3d0&units=metric&lat=" + $scope.position.coords.latitude + "&lon=" + $scope.position.coords.longitude)
                        .then(function onSuccess(response) {
                            $scope.weather = {};
                            $scope.city = response.data.name;
                            $scope.weather.temp = response.data.main.temp;
                            $scope.weather.desc = response.data.weather[0].description;
                            $scope.weather.urlImg = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";
                            $scope.weather.windSpeed = response.data.wind.speed;
                        }, function onFailure(response) {
                            $scope.imageURL = "#";
                        });


                    // Load Flicker Image
                    $scope.imageURL = null;

                    function jsonFlickrApi(response) {
                        $scope.imageURL = "https://farm"
                            + response.photos.photo[0].farm + ".staticflickr.com/"
                            + response.photos.photo[0].server + "/"
                            + response.photos.photo[0].id + "_"
                            + response.photos.photo[0].secret + ".jpg";
                    }

                    $http.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d9a56413243ef425e22e55d40b1c167&lat=" + $scope.position.coords.latitude + "&lon=" + $scope.position.coords.longitude + "&format=json&per_page=1")
                        .then(function onSuccess(response) {
                            eval("(" + response.data + ")");
                        }, function onFailure(response) {
                            $scope.imageURL = "#";
                        });
                });
            });
        } else {
            // Do something if geolocation is not available...
        }

        // Load top news
        $scope.newsLoaded = 0;
        $http.get("http://api.nytimes.com/svc/topstories/v1/world.json?api-key=bd2d6bbcb9d4b9a89adbd70f5b888ef2:0:74097087")
            .then(function onSuccess(response) {
                $scope.newsLoaded = 1;
                $scope.topArticles = response.data.results;
            }, function onFailure(response) {
                $scope.newsLoaded = 2;
            });

        // load best selling books
        $http.get("http://api.nytimes.com/svc/books/v2/lists/hardcover-fiction?api-key=77d395c71cb7353c60557b185eeafb35:18:74097087")
            .then(function onSuccess(response) {
                $scope.booksLoaded = 1;
                $scope.topBooks = [];
                for(var i = 0; i < response.data.results.length; i++) {
                    $scope.topBooks.push({
                        id: i,
                        title: response.data.results[i].book_details[0].title,
                        date: response.data.results[i].published_date,
                        author: response.data.results[i].book_details[0].author,
                        image: response.data.results[i].book_details[0].book_image
                    });
                }
            }, function onFailure(response) {
                $scope.booksLoaded = 2;
            });

        // load league table

        // on récupère les différengte leaugue de la saison
        $scope.leagueLoaded = 0;
        $scope.leagues = null;
        $http.get("http://api.football-data.org/v1/soccerseasons/?season=2015", {headers: {'X-Auth-Token': 'bd5a27e1fbf24182b7e7ac478f6a94d7'}})
            .then(function onSuccess(response) {
                $scope.leagueLoaded = 1;
                $scope.leagues = response.data;

                // on récupère le tableau de la ligue
                $scope.leagues.forEach(function(league)
                    {
                        league.leagueTable=null;
                        $http.get(league._links.leagueTable.href , {headers: {'X-Auth-Token': 'bd5a27e1fbf24182b7e7ac478f6a94d7'}})
                            .then(function onSuccess(response) {
                                league.leagueTable=response.data;
                            }, function onFailure(response) {
                                league.leagueTable=null;
                            });
                    }
                );
            }, function onFailure(response) {
                $scope.leagueLoaded = 2;
            });

    });