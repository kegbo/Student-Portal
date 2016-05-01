(function () {
  'use strict';

  angular
    .module('staff')
    .controller('StaffListController', StaffListController);

  StaffListController.$inject = ['StaffService'];

  function StaffListController(StaffService) {
    var vm = this;

    vm.staff = StaffService.query();
  }
})();
