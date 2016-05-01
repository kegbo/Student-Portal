(function (app) {
  'use strict';

  app.registerModule('students');
  app.registerModule('students.services');
  app.registerModule('students.routes', ['ui.router', 'students.services']);
})(ApplicationConfiguration);
