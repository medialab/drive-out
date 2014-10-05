'use strict';

/**
 * @ngdoc service
 * @name driveoutApp.files
 * @description
 * # files
 * Factory in the driveoutApp.
 */
angular.module('driveoutApp')
  .factory('FilesFactory', function($resource) {
    return $resource('/contents/:path.json',{ }, {
      get: {method:'GET', isArray: true, params: {path: '@path'} }
    });
  });
