(function () {
  'use strict';

  angular
    .module('students')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Students',
      state: 'students',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'students', {
      title: 'List students',
      state: 'students.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'students', {
      title: 'Create students',
      state: 'students.create',
      roles: ['user']
    });
  }
})();
