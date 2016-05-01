(function () {
  'use strict';

  angular
    .module('staff')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Staff',
      state: 'staff',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'staff', {
      title: 'List Staff',
      state: 'staff.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'staff', {
      title: 'Create Staff',
      state: 'staff.create',
      roles: ['user']
    });
  }
})();
