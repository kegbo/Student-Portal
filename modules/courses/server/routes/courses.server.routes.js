'use strict';

/**
 * Module dependencies
 */
var coursesPolicy = require('../policies/courses.server.policy'),
  courses = require('../controllers/courses.server.controller');

module.exports = function (app) {
  // Staff collection routes
  app.route('/api/courses').all(coursesPolicy.isAllowed)
    .get(courses.list)
    .post(courses.create);

  // Single Staffroutes
  app.route('/api/courses/:coursesId').all(coursesPolicy.isAllowed)
    .get(courses.read)
    .put(courses.update)
    .delete(courses.delete);

  // Finish by binding the Staff middleware
  app.param('coursesId', courses.coursesByID);
};
