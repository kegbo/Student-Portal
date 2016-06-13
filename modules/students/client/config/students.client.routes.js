(function () {
  'use strict';

  angular
    .module('students')
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
        controllerAs: 'vm',
        data: {
          pageTitle: 'Students List'
        }
      })
      .state('students.create', {
        url: '/create',
        templateUrl: 'modules/students/client/views/form-student.client.view.html',
        controller: 'StudentsController',
        controllerAs: 'vm',
        resolve: {
          studentResolve: newStudent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Students Create'
        }
      })
      .state('students.edit', {
        url: '/:studentId/edit',
        templateUrl: 'modules/students/client/views/form-student.client.view.html',
        controller: 'StudentsController',
        controllerAs: 'vm',
        resolve: {
          studentResolve: getStudent
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Student {{ studentResolve.name }}'
        }
      })
      .state('students.view', {
        url: '/:studentId',
        templateUrl: 'modules/students/client/views/view-student.client.view.html',
        controller: 'StudentsController',
        controllerAs: 'vm',
        resolve: {
          studentResolve: getStudent
        },
        data:{
          pageTitle: 'Student {{ articleResolve.name }}'
        }
      });
  }

  getStudent.$inject = ['$stateParams', 'StudentsService'];

  function getStudent($stateParams, StudentsService) {
    return StudentsService.get({
      studentId: $stateParams.studentId
    }).$promise;
  }

  newStudent.$inject = ['StudentsService'];

  function newStudent(StudentsService) {
    return new StudentsService();
  }
})();
