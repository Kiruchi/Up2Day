'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'ui.bootstrap'
    ])
    .controller('mainController', function ($scope, $http) {
        $scope.weatherUrl = "//api.openweathermap.org/data/2.5/weather?APPID=929a9d959a9525b0119016c485eef3d0";
        $scope.flickerUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d9a56413243ef425e22e55d40b1c167";
        $scope.bestSellingBooksUrl = "//api.nytimes.com/svc/books/v2/lists/hardcover-fiction?api-key=77d395c71cb7353c60557b185eeafb35:18:74097087";
        $scope.leaguesUrl = "http://api.football-data.org/v1/soccerseasons/";
        $scope.newsUrl = "//api.nytimes.com/svc/topstories/v1/world.json?api-key=bd2d6bbcb9d4b9a89adbd70f5b888ef2:0:74097087";
        $scope.date = new Date();

        // Find geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.$apply(function () {
                    $scope.position = position;
                    console.log($scope.position);

                    // Load weather
                    $scope.city = null;
                    $scope.weather = null;
                    $scope.weatherLoaded = 0;

                    $http.get($scope.weatherUrl + "&units=metric&lat=" + $scope.position.coords.latitude + "&lon=" + $scope.position.coords.longitude)
                        .then(
                            /**
                             * @param response
                             * @param response.data
                             * @param response.data.wind
                             */
                            function onSuccess(response) {
                                $scope.weatherLoaded = 1;
                                $scope.weather = {};
                                $scope.city = response.data.name;
                                $scope.weather.temp = response.data.main.temp;
                                $scope.weather.desc = response.data.weather[0].description;
                                $scope.weather.urlImg = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";
                                $scope.weather.windSpeed = response.data.wind.speed;
                            }, function onFailure(response) {
                                $scope.weatherLoaded = 2;
                                $scope.imageURL = "#";
                                console.log(response);
                            });


                    // Load Flicker Image
                    $scope.imageURL = null;
                    $scope.flickrImageLoaded = 0;

                    //noinspection JSUnusedLocalSymbols
                    /**
                     * Callback from Flickr JSONP
                     *
                     * @param response
                     * @param response.photos.photo
                     * @param response.photos.photo.farm
                     * @param response.photos.photo.secret
                     */
                    function jsonFlickrApi(response) {
                        $scope.imageURL = "https://farm"
                            + response.photos.photo[0].farm + ".staticflickr.com/"
                            + response.photos.photo[0].server + "/"
                            + response.photos.photo[0].id + "_"
                            + response.photos.photo[0].secret + ".jpg";

                        $scope.flickrImageLoaded = 1;
                    }

                    $http.get($scope.flickerUrl + "&lat=" + $scope.position.coords.latitude + "&lon=" + $scope.position.coords.longitude + "&format=json&per_page=1")
                        .then(
                            /**
                             * @param response
                             * @param response.data
                             */
                            function onSuccess(response) {
                                eval("(" + response.data + ")");
                            }, function onFailure(response) {
                                $scope.imageURL = "#";
                                $scope.flickrImageLoaded = 2;
                                console.log(response);
                            });
                });
            });
        } else {
            // Do something if geolocation is not available...
        }

        // Load top news
        $scope.newsLoaded = 0;
        $http.get($scope.newsUrl )
            .then(
                /**
                 * @param response
                 * @param response.data
                 */
                function onSuccess(response) {
                    $scope.newsLoaded = 1;
                    if (response.data) {
                        $scope.topArticles = response.data.results;
                    }

                }, function onFailure(response) {
                    $scope.newsLoaded = 2;
                    console.log(response);
                });

        // Load best selling books
        $scope.booksLoaded = 0;
        $http.get($scope.bestSellingBooksUrl)
            .then(
                /**
                 * @param response
                 * @param response.data
                 * @param response.results.book_details
                 * @param response.results.book_details.book_image
                 * @param response.results.published_date
                 */
                function onSuccess(response) {
                    $scope.booksLoaded = 1;
                    $scope.topBooks = [];
                    for (var i = 0; i < response.data.results.length; i++) {
                        $scope.topBooks.push({
                            id: i,
                            title: response.data.results[i].book_details[0].title,
                            date: response.data.results[i].published_date,
                            author: response.data.results[i].book_details[0].author,
                            image: response.data.results[i].book_details[0].book_image,
                            byline : response.data.results[i].book_details[0].byline
                        });
                    }
                }, function onFailure(response) {
                    $scope.booksLoaded = 2;
                    console.log(response);
                });

        // Load leagues
        $scope.leagues = null;
        $scope.leaguesLoaded = 0;
        $http.get($scope.leaguesUrl + "?season=2015", {headers: {'X-Auth-Token': 'bd5a27e1fbf24182b7e7ac478f6a94d7'}})
            .then(
                /**
                 * @param response
                 * @param response.data
                 */
                function onSuccess(response) {
                    $scope.leagueLoaded = 1;
                    $scope.leagues = response.data;

                    // on récupère le tableau de la ligue
                    $scope.leagues.forEach(
                        /**
                         * @param league
                         * @param league._links
                         */
                        function (league) {
                            league.leagueTable = null;
                            $http.get(league._links.leagueTable.href, {headers: {'X-Auth-Token': 'bd5a27e1fbf24182b7e7ac478f6a94d7'}})
                                .then(
                                    /**
                                     * @param response
                                     * @param response.data
                                     */
                                    function onSuccess(response) {
                                        league.leagueTable = response.data;
                                    }, function onFailure(response) {
                                        league.leagueTable = null;
                                        console.log(response);
                                    });
                        }
                    );
                }, function onFailure(response) {
                    $scope.leagueLoaded = 2;
                    console.log(response);
                });

    });