'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp')
  .controller('MainCtrl', function ($scope, $log) {
    $log.log('MainCtrl ready');
    $scope.$parent.page = {};
    $scope.$watch('routes', function(){
      $log.info('routes loaded');
      $scope.items = $scope.routes;
      $scope.$parent.folders = [];
    })
  });
