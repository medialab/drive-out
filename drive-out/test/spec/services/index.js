'use strict';

describe('Service: index', function () {

  // load the service's module
  beforeEach(module('driveoutApp'));

  // instantiate service
  var index;
  beforeEach(inject(function (_index_) {
    index = _index_;
  }));

  it('should do something', function () {
    expect(!!index).toBe(true);
  });

});
