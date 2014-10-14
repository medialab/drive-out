'use strict';

/**
 * @ngdoc service
 * @name driveoutApp.file
 * @description
 * # file
 * Factory in the driveoutApp.
 */
angular.module('driveoutApp')
  .factory('file', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
