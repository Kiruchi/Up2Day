'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ngRoute',
        'ui.bootstrap',
        'LocalStorageModule'
    ])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('ls');
    }])
    .controller('mainController', function ($http, localStorageService) {
        var up2day = this;
        up2day.weatherUrl = "//api.openweathermap.org/data/2.5/weather?APPID=929a9d959a9525b0119016c485eef3d0";
        up2day.flickerUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3d9a56413243ef425e22e55d40b1c167";
        up2day.bestSellingBooksUrl = "//api.nytimes.com/svc/books/v2/lists/hardcover-fiction?api-key=77d395c71cb7353c60557b185eeafb35:18:74097087";
        up2day.leaguesUrl = "http://api.football-data.org/v1/soccerseasons/";
        up2day.newsUrl = "//api.nytimes.com/svc/topstories/v1/world.json?api-key=bd2d6bbcb9d4b9a89adbd70f5b888ef2:0:74097087";
        up2day.date = new Date();

        var switchsInStore = localStorageService.get('switchs');

        up2day.switchs = switchsInStore || {weather: true, flickrImage: true, news: true, topSellingBooks: true};

        up2day.saveInfopanels = function() {
            localStorageService.set('switchs', up2day.switchs);
        };

        // Find geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position);

                // Load weather
                up2day.city = null;
                up2day.weather = null;
                up2day.weatherLoaded = 0;

                $http.get(up2day.weatherUrl + "&units=metric&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude)
                    .then(
                        /**
                         * @param response
                         * @param response.data
                         * @param response.data.wind
                         */
                        function onSuccess(response) {
                            up2day.weatherLoaded = 1;
                            up2day.weather = {};
                            up2day.city = response.data.name;
                            up2day.weather.temp = response.data.main.temp;
                            up2day.weather.desc = response.data.weather[0].description;
                            up2day.weather.urlImg = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";
                            up2day.weather.windSpeed = response.data.wind.speed;
                        }, function onFailure() {
                            up2day.weatherLoaded = 2;
                            up2day.weather.urlImg = "#";
                        });


                // Load Flicker Image
                up2day.imageURL = null;
                up2day.flickrImageLoaded = 0;

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
                    up2day.imageURL = "https://farm"
                        + response.photos.photo[0].farm + ".staticflickr.com/"
                        + response.photos.photo[0].server + "/"
                        + response.photos.photo[0].id + "_"
                        + response.photos.photo[0].secret + ".jpg";

                    up2day.flickrImageLoaded = 1;
                }

                $http.get(up2day.flickerUrl + "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&format=json&per_page=1")
                    .then(
                        /**
                         * @param response
                         * @param response.data
                         */
                        function onSuccess(response) {
                            eval("(" + response.data + ")");
                        }, function onFailure() {
                            up2day.imageURL = "#";
                            up2day.flickrImageLoaded = 2;
                        });
            });
        } else {
            // Do something if geolocation is not available...
        }

        // Load top news
        up2day.newsLoaded = 0;
        up2day.topArticles = null;

        $http.get(up2day.newsUrl)
            .then(
                /**
                 * @param response
                 * @param response.data
                 */
                function onSuccess(response) {
                    up2day.newsLoaded = 1;
                    if (response.data) {
                        up2day.topArticles = response.data.results;
                    }

                }, function onFailure() {
                    up2day.newsLoaded = 2;
                });

        // Load best selling books
        up2day.booksLoaded = 0;
        up2day.topBooks = [];

        $http.get(up2day.bestSellingBooksUrl)
            .then(
                /**
                 * @param response
                 * @param response.data
                 * @param response.results.book_details
                 * @param response.results.book_details.book_image
                 * @param response.results.published_date
                 */
                function onSuccess(response) {
                    up2day.booksLoaded = 1;

                    for (var i = 0; i < response.data.results.length; i++) {
                        up2day.topBooks.push({
                            id: i,
                            title: response.data.results[i].book_details[0].title,
                            date: response.data.results[i].published_date,
                            author: response.data.results[i].book_details[0].author,
                            image: response.data.results[i].book_details[0].book_image,
                            byline: response.data.results[i].book_details[0].byline
                        });
                    }
                }, function onFailure() {
                    up2day.booksLoaded = 2;
                });

        // Load leagues
        up2day.leagues = null;
        up2day.leaguesLoaded = 0;

        $http.get(up2day.leaguesUrl + "?season=2015", {headers: {'X-Auth-Token': 'bd5a27e1fbf24182b7e7ac478f6a94d7'}})
            .then(
                /**
                 * @param response
                 * @param response.data
                 */
                function onSuccess(response) {
                    up2day.leaguesLoaded = 1;
                    up2day.leagues = response.data;

                    // on récupère le tableau de la ligue
                    up2day.leagues.forEach(
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
                                    }, function onFailure() {
                                        league.leagueTable = null;
                                    });
                        }
                    );
                }, function onFailure() {
                    up2day.leaguesLoaded = 2;
                });

    });