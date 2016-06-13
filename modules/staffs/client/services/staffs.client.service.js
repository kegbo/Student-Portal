//Staffs service used to communicate Staffs REST endpoints
(function () {
  'use strict';

  angular
    .module('staffs')
    .factory('StaffsService', StaffsService);

  StaffsService.$inject = ['$resource'];

  function StaffsService($resource) {
    return $resource('api/staffs/:staffId', {
      staffId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
