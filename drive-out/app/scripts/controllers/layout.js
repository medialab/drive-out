'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:LayoutCtrl
 * @description
 * # LayoutCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp')
  .controller('LayoutCtrl', function ($scope, $log, $route, FilesFactory) {
    $scope.page = {};
    $log.log('LayoutCtrl ready', $route);
    //$scope.path = $route.current.params.path;
    $scope.routes = FilesFactory.get({path:'index'}); // we will then filter for the menu items
  });
