(function () {
  'use strict';

  angular
    .module('courses')
    .controller('CoursesListController', CoursesListController);

  CoursesListController.$inject = ['CoursesService'];

  function CoursesListController(CoursesService) {
    var vm = this;

    vm.courses = CoursesService.query();
  }
})();
