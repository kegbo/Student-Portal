(function () {
  'use strict';

  angular
    .module('staffs')
    .controller('StaffsListController', StaffsListController);

  StaffsListController.$inject = ['StaffsService'];

  function StaffsListController(StaffsService) {
    var vm = this;

    vm.staffs = StaffsService.query();
    
  }
})();
