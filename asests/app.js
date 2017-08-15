// 'use strict';
// Declare app level module which depends on views, and components
angular.module('myApp', [
        'ui.router',
        'ngMaterial',
        'ngAnimate',
        'ngAria',
        'ui.bootstrap',
        'squaredSDController',
        "squaredSDService",
    ])
    .run(function($rootScope, $location, $window, $state, $timeout) {

    })
    .constant('apiUrl', 'http://127.0.0.1:8000/') //Local URL

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
        $stateProvider
            .state('app', {
                url: "",
                views: {
                    "main": {
                        templateUrl: "static/templates/app.html?v=1",
                        controller: "appCtrl"
                    }
                },
            })
        .state('app.home', {
            url: "/",
            views: {
                "content": {
                    templateUrl: "static/templates/home.html?v=1",
                    controller: "homeCtrl"
                },
            },

        })
        .state('app.createProducts', {
            url: "/create-products",
            views: {
                "content": {
                    templateUrl: "static/templates/products.html?v=1",
                    controller: "createProductCtrl"
                },
            },
        });
        $urlRouterProvider.otherwise("/");
        $locationProvider.html5Mode(true);
    }])
    