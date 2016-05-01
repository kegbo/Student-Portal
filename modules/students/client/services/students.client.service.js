(function () {
  'use strict';

  angular
    .module('students.services')
    .factory('StudentsService', StudentsService);

  StudentsService.$inject = ['$resource'];

  function StudentsService($resource) {
    return $resource('api/courses/:studentsId', {
      studentsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
