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
    FilesFactory.get({path:'index'}).then(function(res){
      $scope.routes = res.data;
    }); // we will then filter for the menu items
    // has subfolders?
  });
