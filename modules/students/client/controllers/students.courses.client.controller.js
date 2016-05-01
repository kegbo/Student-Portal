(function () {
  'use strict';

  angular
    .module('students')
    .controller('StudentsListController', StudentsListController);

  StudentsListController.$inject = ['StudentsService'];

  function StudentsListController(StudentsService) {
    var vm = this;

    vm.students = StudentsService.query();
  }
})();
