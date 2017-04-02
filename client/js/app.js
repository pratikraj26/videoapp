var videoApp = angular.module('videoApp', [
  'ngVideo',
  'ngRoute',
  'ui.carousel'
]);

videoApp.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.
  when('/home', {
    templateUrl: 'views/landing/landing.html',
    controller: 'landingController'
  }).
  when('/history', {
    templateUrl: 'views/history/history.html',
    controller: 'historyController'
  }).
  when('/player/:id/:index', {
    templateUrl: 'views/player/player.html',
    controller: 'playerController'
  }).
  otherwise({redirectTo:'/home'});
})
