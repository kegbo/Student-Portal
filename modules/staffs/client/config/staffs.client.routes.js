(function () {
  'use strict';

  angular
    .module('staffs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('staffs', {
        abstract: true,
        url: '/staffs',
        template: '<ui-view/>'
      })
      .state('staffs.list', {
        url: '',
        templateUrl: 'modules/staffs/client/views/list-staffs.client.view.html',
        controller: 'StaffsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Staffs List'
        }
      })
      .state('staffs.create', {
        url: '/create',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: newStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Staffs Create'
        }
      })
      .state('staffs.edit', {
        url: '/:staffId/edit',
        templateUrl: 'modules/staffs/client/views/form-staff.client.view.html',
        controller: 'StaffsController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Staff {{ staffResolve.name }}'
        }
      })
      .state('staffs.view', {
        url: '/:staffId',
        templateUrl: 'modules/staffs/client/views/view-staff.client.view.html',
        controller: 'StaffsController',
        controllerAs: 'vm',
        resolve: {
          staffResolve: getStaff
        },
        data:{
          pageTitle: 'Staff {{ articleResolve.name }}'
        }
      });
  }

  getStaff.$inject = ['$stateParams', 'StaffsService'];

  function getStaff($stateParams, StaffsService) {
    return StaffsService.get({
      staffId: $stateParams.staffId
    }).$promise;
  }

  newStaff.$inject = ['StaffsService'];

  function newStaff(StaffsService) {
    return new StaffsService();
  }
})();
