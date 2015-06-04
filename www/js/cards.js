/**
 * Created by LAKSHAY on 01-06-2015.
 */
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'firebase', 'ionic.utils'])


    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $stateProvider
            .state('intro', {
                url: '/',
                templateUrl: 'templates/intro.html',
                controller: 'IntroCtrl'
            })
            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'CardsCtrl'
            });

        //alert(window.localStorage["seen"]);
        if (window.localStorage["seen"] == 'true')
            $urlRouterProvider.otherwise("/main");
        else
            $urlRouterProvider.otherwise("/");

    })

    /*   .run(function($http) {
     $http.defaults.useXDomain = true;
     })*/

    .directive('noScroll', function ($document) {

        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {

                $document.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })


    .controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate,$localstorage) {

        $localstorage.set("seen",'true');

        // Called to navigate to the main app
        $scope.startApp = function () {
            $state.go('main');
        };
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };
    })

    .controller('CardsCtrl', function ($scope, TDCardDelegate, $firebaseArray, $ionicLoading) {

        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>',
            noBackdrop: true
        });

        console.log('CARDS CTRL');
        /*var cardTypes = [
         {image: 'https://pbs.twimg.com/profile_images/505672346028363777/R67aize2_400x400.jpeg', meaning: 'a'},
         {image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png', meaning: 'b'},
         {image: 'https://pbs.twimg.com/profile_banners/353520978/1403769555/1500x500', meaning: 'c'},
         {image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png', meaning: 'd'},
         {image: 'https://pbs.twimg.com/profile_banners/353520978/1403769555/1500x500', meaning: 'e'},
         {image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png', meaning: 'f'},
         {image: 'https://pbs.twimg.com/profile_banners/353520978/1403769555/1500x500', meaning: 'g'}
         ];*/

        //cardTypes = Words.query(function() {
        //    console.log(cardTypes);
        //}); //query() returns all the entries

        var ref = new Firebase("https://scorching-fire-4794.firebaseio.com/words/widgets");
        // download the data into a local object
        //console.log(ref);
        var cardTypes = $firebaseArray(ref);

        var originalCardTypes = [];

        cardTypes.$loaded(function (c) {
            originalCardTypes = Array.prototype.slice.call(c, 0, c.length);
            $ionicLoading.hide();
        });

        //setTimeout(function(){console.log(cardTypes);},3000);

        $scope.cards = cardTypes; //Array.prototype.slice.call(cardTypes, 0, 5);
        $scope.pageIndex = 4;

        //$scope.current = $scope.cards[0];

        $scope.cardDestroyed = function (index) {
            index = 0; // dunno why index goes to 1..will look at it later
            $scope.cards.splice(index, 1);
            //$scope.current = $scope.cards[0];
        };

        $scope.addCard = function () {
            if (++$scope.pageIndex >= cardTypes.length)
                return;

            var newCard = originalCardTypes[$scope.pageIndex];
            //newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        };

        $scope.cardSwipedLeft = function (index) {
            console.log('LEFT SWIPE');
            $scope.cardSwiped();
        };

        $scope.cardSwipedRight = function (index) {
            console.log('RIGHT SWIPE');
            $scope.cardSwiped();
        };

        $scope.cardSwiped = function (index) {
            //$scope.addCard();
        };
    });


angular.module('ionic.utils', [])

    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]);