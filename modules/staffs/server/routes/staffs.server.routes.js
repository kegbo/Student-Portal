'use strict';

/**
 * Module dependencies
 */
var staffsPolicy = require('../policies/staffs.server.policy'),
  staffs = require('../controllers/staffs.server.controller');

module.exports = function(app) {
  // Staffs Routes
  app.route('/api/staffs').all(staffsPolicy.isAllowed)
    .get(staffs.list)
    .post(staffs.create);

  app.route('/api/staffs/:staffId').all(staffsPolicy.isAllowed)
    .get(staffs.read)
    .put(staffs.update)
    .delete(staffs.delete);

  // Finish by binding the Staff middleware
  app.param('staffId', staffs.staffByID);
};
