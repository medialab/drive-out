'use strict';

/**
 * @ngdoc overview
 * @name driveoutApp
 * @description
 * # driveoutApp
 *
 * Main module of the application.
 */
angular
  .module('driveoutApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'perfect_scrollbar'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/page.html',
        controller: 'MainCtrl'
      })
      .when('/:page', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl',
        resolve: {
          items : function ($route, FilesFactory) {
            return FilesFactory.get({path: $route.current.params.page + '/index'});
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
