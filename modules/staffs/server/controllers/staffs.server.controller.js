'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Staff = mongoose.model('Staff'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Staff
 */
exports.create = function(req, res) {
  var staff = new Staff(req.body);
  staff.user = req.user;

  staff.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
};

/**
 * Show the current Staff
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var staff = req.staff ? req.staff.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  staff.isCurrentUserOwner = req.user && staff.user && staff.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(staff);
};

/**
 * Update a Staff
 */
exports.update = function(req, res) {
  var staff = req.staff ;

  staff = _.extend(staff , req.body);

  staff.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
};

/**
 * Delete an Staff
 */
exports.delete = function(req, res) {
  var staff = req.staff ;

  staff.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staff);
    }
  });
};

/**
 * List of Staffs
 */
exports.list = function(req, res) { 
  Staff.find().sort('-created').populate('user', 'displayName').exec(function(err, staffs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(staffs);
    }
  });
};

/**
 * Staff middleware
 */
exports.staffByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Staff is invalid'
    });
  }

  Staff.findById(id).populate('user','courses').exec(function (err, staff) {
    if (err) {
      return next(err);
    } else if (!staff) {
      return res.status(404).send({
        message: 'No Staff with that identifier has been found'
      });
    }
    req.staff = staff;
    next();
  });
};
