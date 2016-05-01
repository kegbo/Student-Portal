'use strict';

/**
 * Module dependencies
 */
var staffPolicy = require('../policies/staff.server.policy'),
  staff = require('../controllers/staff.server.controller');

module.exports = function (app) {
  // Staff collection routes
  app.route('/api/staff').all(staffPolicy.isAllowed)
    .get(staff.list)
    .post(staff.create);

  // Single Staffroutes
  app.route('/api/staff/:staffId').all(staffPolicy.isAllowed)
    .get(staff.read)
    .put(staff.update)
    .delete(staff.delete);

  // Finish by binding the Staff middleware
  app.param('staffId', staff.staffByID);
};
