(function () {
  'use strict';

  angular
    .module('courses')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Courses',
      state: 'courses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'courses', {
      title: 'List courses',
      state: 'courses.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'courses', {
      title: 'Create Courses',
      state: 'courses.create',
      roles: ['user']
    });
  }
})();
