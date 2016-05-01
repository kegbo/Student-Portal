'use strict';

/**
 * Module dependencies
 */
var studentsPolicy = require('../policies/students.server.policy'),
  students = require('../controllers/students.server.controller');

module.exports = function (app) {
  // Staff collection routes
  app.route('/api/students').all(studentsPolicy.isAllowed)
    .get(students.list)
    .post(students.create);

  // Single Staffroutes
  app.route('/api/students/:studentsId').all(studentsPolicy.isAllowed)
    .get(students.read)
    .put(students.update)
    .delete(students.delete);

  // Finish by binding the Staff middleware
  app.param('studentsId', students.studentsByID);
};
