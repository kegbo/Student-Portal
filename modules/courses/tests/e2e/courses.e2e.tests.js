'use strict';

describe('Courses E2E Tests:', function () {
  describe('Test Courses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/courses');
      expect(element.all(by.repeater('course in courses')).count()).toEqual(0);
    });
  });
});
