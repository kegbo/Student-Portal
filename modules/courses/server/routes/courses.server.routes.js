'use strict';

/**
 * Module dependencies
 */
var coursesPolicy = require('../policies/courses.server.policy'),
  courses = require('../controllers/courses.server.controller');

module.exports = function(app) {
  // Courses Routes
  app.route('/api/courses').all(coursesPolicy.isAllowed)
    .get(courses.list)
    .post(courses.create);

  app.route('/api/courses/:courseId').all(coursesPolicy.isAllowed)
    .get(courses.read)
    .put(courses.update)
    .delete(courses.delete);

  // Finish by binding the Course middleware
  app.param('courseId', courses.courseByID);
};
