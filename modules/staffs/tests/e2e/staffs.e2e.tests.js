'use strict';

describe('Staffs E2E Tests:', function () {
  describe('Test Staffs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/staffs');
      expect(element.all(by.repeater('staff in staffs')).count()).toEqual(0);
    });
  });
});
