//Students service used to communicate Students REST endpoints
(function () {
  'use strict';

  angular
    .module('students')
    .factory('StudentsService', StudentsService);

  StudentsService.$inject = ['$resource'];

  function StudentsService($resource) {
    return $resource('api/students/:studentId', {
      studentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
