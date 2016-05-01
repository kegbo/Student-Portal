(function (app) {
  'use strict';

  app.registerModule('staff');
  app.registerModule('staff.services');
  app.registerModule('staff.routes', ['ui.router', 'staff.services']);
})(ApplicationConfiguration);
