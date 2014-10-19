'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:DepthCtrl
 * @description
 * # DepthCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp')
  .controller('DepthCtrl', function ($scope, items, parents, $log, $routeParams) {
    $scope.items = items.data;
    $scope.$parent.folders = angular.copy(parents.data).filter(function(d) {
      if(d.type=='folder')
        return d;
    });

    // filter stuffs
    $scope.$watch('routes', function(){ // get title
      $scope.$parent.page = angular.copy($scope.routes)
        .filter(function(d){ return d.slug==$routeParams.page })
        .pop();
      $log.info('routes loaded', $scope.page)
    })
  });
