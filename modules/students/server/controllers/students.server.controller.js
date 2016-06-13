'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Student
 */
exports.create = function(req, res) {
  var student = new Student(req.body);
  student.user = req.user;

  student.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(student);
    }
  });
};

/**
 * Show the current Student
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var student = req.student ? req.student.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  student.isCurrentUserOwner = req.user && student.user && student.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(student);
};

/**
 * Update a Student
 */
exports.update = function(req, res) {
  var student = req.student ;

  student = _.extend(student , req.body);

  student.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(student);
    }
  });
};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {
  var student = req.student ;

  student.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(student);
    }
  });
};

/**
 * List of Students
 */
exports.list = function(req, res) { 
  Student.find().sort('-created').populate('user', 'displayName').exec(function(err, students) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(students);
    }
  });
};

/**
 * Student middleware
 */
exports.studentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Student is invalid'
    });
  }

  Student.findById(id).populate('user','course').exec(function (err, student) {
    if (err) {
      return next(err);
    } else if (!student) {
      return res.status(404).send({
        message: 'No Student with that identifier has been found'
      });
    }
    req.student = student;
    next();
  });
};
