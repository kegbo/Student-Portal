(function () {
  'use strict';

  angular
    .module('courses.services')
    .factory('CoursesService', CoursesService);

  CoursesService.$inject = ['$resource'];

  function CoursesService($resource) {
    return $resource('api/courses/:coursesId', {
      coursesId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
