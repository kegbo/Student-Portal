(function () {
  'use strict';

  angular
    .module('courses')
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
        controllerAs: 'vm',
        data: {
          pageTitle: 'Courses List'
        }
      })
      .state('courses.create', {
        url: '/create',
        templateUrl: 'modules/courses/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: newCourse
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Courses Create'
        }
      })
      .state('courses.edit', {
        url: '/:courseId/edit',
        templateUrl: 'modules/courses/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Course {{ courseResolve.name }}'
        }
      })
      .state('courses.view', {
        url: '/:courseId',
        templateUrl: 'modules/courses/client/views/view-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data:{
          pageTitle: 'Course {{ articleResolve.name }}'
        }
      });
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }
})();
