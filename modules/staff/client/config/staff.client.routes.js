(function () {
  'use strict';

  angular
    .module('staff.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('staff', {
        abstract: true,
        url: '/staff',
        template: '<ui-view/>'
      })
      .state('staff.list', {
        url: '',
        templateUrl: 'modules/staff/client/views/list-staff.client.view.html',
        controller: 'StaffListController',
        controllerAs: 'vm'
      })
      .state('staff.create', {
        url: '/create',
        templateUrl: 'modules/staff/client/views/form-staff.client.view.html',
        controller: 'StaffController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: newStaff
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('staff.edit', {
        url: '/:staffId/edit',
        templateUrl: 'modules/staff/client/views/form-staff.client.view.html',
        controller: 'StaffController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('staff.view', {
        url: '/:staffId',
        templateUrl: 'modules/staff/client/views/view-staff.client.view.html',
        controller: 'StaffController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        }
      });
  }

  getStaff.$inject = ['$stateParams', 'StaffService'];

  function getStaff($stateParams, StaffService) {
    return StaffService.get({
      staffId: $stateParams.staffId
    }).$promise;
  }

  newStaff.$inject = ['StaffService'];

  function newStaff(StaffService) {
    return new StaffService();
  }
})();
