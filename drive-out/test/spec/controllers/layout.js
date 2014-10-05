'use strict';

describe('Controller: LayoutCtrl', function () {

  // load the controller's module
  beforeEach(module('driveoutApp'));

  var LayoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LayoutCtrl = $controller('LayoutCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
