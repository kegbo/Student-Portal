'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Staff = mongoose.model('Staff'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an staff
 */
exports.create = function (req, res) {
  var staff = new Staff(req.body);
  staff.user = req.user;

  staff.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(staff);
    }
  });
};

/**
 * Show the current staff
 */
exports.read = function (req, res) {
  res.json(req.staff);
};

/**
 * Update an staff
 */
exports.update = function (req, res) {
  var staff = req.staff;

  staff.staffnum = req.body.staffnum;
  staff.firstname = req.body.firstname;
  staff.lastname = req.body.lastname;
  staff.position = req.body.position;
  staff.phoneNumber = req.body.phoneNumber;
  staff.department = req.body.department;
  staff.faculty = req.body.faculty;
  staff.courses = req.body.courses;

  staff.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(staff);
    }
  });
};

/**
 * Delete an staff
 */
exports.delete = function (req, res) {
  var staff = req.staff;

  staff.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(staff);
    }
  });
};

/**
 * List of staff
 */
exports.list = function (req, res) {
  Staff.find().sort('-created').populate('user', 'displayName').exec(function (err, staff) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(staff);
    }
  });
};

/**
 * staff middleware
 */

 /*
TODO
exports by name
exports by lastname
exports by dept
export by faculty
export by staffnumber

 */
exports.staffByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Staff is invalid'
    });
  }


  Staff.findById(id).populate('user', 'displayName').exec(function (err, staff) {
    if (err) {
      return next(err);
    } else if (!staff) {
      return res.status(404).send({
        message: 'No staff with that identifier has been found'
      });
    }
    req.staff = staff;
    next();
  });
};
