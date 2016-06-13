(function () {
  'use strict';

  angular
    .module('staffs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Staffs',
      state: 'staffs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'staffs', {
      title: 'List Staffs',
      state: 'staffs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'staffs', {
      title: 'Create Staff',
      state: 'staffs.create',
      roles: ['user']
    });
  }
})();
