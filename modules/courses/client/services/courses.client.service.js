//Courses service used to communicate Courses REST endpoints
(function () {
  'use strict';

  angular
    .module('courses')
    .factory('CoursesService', CoursesService);

  CoursesService.$inject = ['$resource'];

  function CoursesService($resource) {
    return $resource('api/courses/:courseId', {
      courseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
