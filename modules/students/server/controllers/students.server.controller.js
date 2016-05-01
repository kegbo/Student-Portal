'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Students = mongoose.model('Students'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an courses
 */
exports.create = function (req, res) {
  var students = new Students(req.body);
  students.user = req.user;

  students.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(students);
    }
  });
};

/**
 * Show the current courses
 */
exports.read = function (req, res) {
  res.json(req.students);
};

/**
 * Update an courses
 */
exports.update = function (req, res) {
  var students = req.students;

  students.title = req.body.title;
  students.content = req.body.content;

  students.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(students);
    }
  });
};

/**
 * Delete an courses
 */
exports.delete = function (req, res) {
  var students = req.students;

  students.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(students);
    }
  });
};

/**
 * List of courses
 */
exports.list = function (req, res) {
  Students.find().sort('-created').populate('user', 'displayName').exec(function (err, students) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(students);
    }
  });
};

/**
 * courses middleware
 */
exports.studentsByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'students is invalid'
    });
  }

  Students.findById(id).populate('user', 'displayName').exec(function (err, students) {
    if (err) {
      return next(err);
    } else if (!students) {
      return res.status(404).send({
        message: 'No students with that identifier has been found'
      });
    }
    req.students = students;
    next();
  });
};
