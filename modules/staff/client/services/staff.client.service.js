(function () {
  'use strict';

  angular
    .module('staff.services')
    .factory('StaffService', StaffService);

  StaffService.$inject = ['$resource'];

  function StaffService($resource) {
    return $resource('api/staff/:staffId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
