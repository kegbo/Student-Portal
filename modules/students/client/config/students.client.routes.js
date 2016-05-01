(function () {
  'use strict';

  angular
    .module('students.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('students', {
        abstract: true,
        url: '/students',
        template: '<ui-view/>'
      })
      .state('students.list', {
        url: '',
        templateUrl: 'modules/students/client/views/list-students.client.view.html',
        controller: 'StudentsListController',
        controllerAs: 'vm'
      })
      .state('students.create', {
        url: '/create',
        templateUrl: 'modules/students/client/views/form-students.client.view.html',
        controller: 'StudentsController',
        controllerAs: 'vm',
        resolve: {
          studentsResolve: newStudents
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('students.edit', {
        url: '/:studentsId/edit',
        templateUrl: 'modules/students/client/views/form-students.client.view.html',
        controller: 'StudentsController',
        controllerAs: 'vm',
        resolve: {
          studentsResolve: getStudents
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('students.view', {
        url: '/:coursesId',
        templateUrl: 'modules/students/client/views/view-students.client.view.html',
        controller: 'StudentsController',
        controllerAs: 'vm',
        resolve: {
          studentsResolve: getStudents
        }
      });
  }

  getStudents.$inject = ['$stateParams', 'StudentsService'];

  function getStudents($stateParams, StudentsService) {
    return StudentsService.get({
      studentsId: $stateParams.studentsId
    }).$promise;
  }

  newStudents.$inject = ['StudentsService'];

  function newStudents(StudentsService) {
    return new StudentsService();
  }
})();
