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
    //'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/page.html',
        controller: 'MainCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
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
      .when('/:page/:sub', {
        templateUrl: 'views/page.html',
        controller: 'DepthCtrl', // handle the items loading
        resolve: {
          items : function ($route, FilesFactory) {
            return FilesFactory.get({path: $route.current.params.page + '/' + $route.current.params.sub + '/index'});
          },
          parents : function ($route, FilesFactory) {
            return FilesFactory.get({path: $route.current.params.page + '/index'});
          }
        }
      })
      .otherwise({
        redirectTo: '/404'
      });
  })
  .config(function ($resourceProvider) {
    console.log($resourceProvider)
    $resourceProvider.defaults.stripTrailingSlashes = false;
  })