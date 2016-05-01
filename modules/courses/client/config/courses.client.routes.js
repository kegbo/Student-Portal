(function () {
  'use strict';

  angular
    .module('courses.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('courses.list', {
        url: '',
        templateUrl: 'modules/courses/client/views/list-courses.client.view.html',
        controller: 'CoursesListController',
        controllerAs: 'vm'
      })
      .state('courses.create', {
        url: '/create',
        templateUrl: 'modules/courses/client/views/form-courses.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          coursesResolve: newCourses
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('courses.edit', {
        url: '/:coursesId/edit',
        templateUrl: 'modules/courses/client/views/form-courses.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          coursesResolve: getCourses
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('courses.view', {
        url: '/:coursesId',
        templateUrl: 'modules/courses/client/views/view-courses.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          coursesResolve: getCourses
        }
      });
  }

  getCourses.$inject = ['$stateParams', 'CoursesService'];

  function getCourses($stateParams, CoursesService) {
    return CoursesService.get({
      coursesId: $stateParams.coursesId
    }).$promise;
  }

  newCourses.$inject = ['CoursesService'];

  function newCourses(CoursesService) {
    return new CoursesService();
  }
})();
