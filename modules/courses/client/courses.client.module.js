(function (app) {
  'use strict';

  app.registerModule('courses');
  app.registerModule('courses.services');
  app.registerModule('courses.routes', ['ui.router', 'courses.services']);
})(ApplicationConfiguration);
