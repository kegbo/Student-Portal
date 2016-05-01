'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Courses = mongoose.model('Courses'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an courses
 */
exports.create = function (req, res) {
  var courses = new Courses(req.body);
  courses.user = req.user;

  courses.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courses);
    }
  });
};

/**
 * Show the current courses
 */
exports.read = function (req, res) {
  res.json(req.courses);
};

/**
 * Update an courses
 */
exports.update = function (req, res) {
  var courses = req.courses;

  courses.title = req.body.title;
  courses.content = req.body.content;

  courses.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courses);
    }
  });
};

/**
 * Delete an courses
 */
exports.delete = function (req, res) {
  var courses = req.courses;

  courses.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courses);
    }
  });
};

/**
 * List of courses
 */
exports.list = function (req, res) {
  Courses.find().sort('-created').populate('user', 'displayName').exec(function (err, courses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(courses);
    }
  });
};

/**
 * courses middleware
 */
exports.coursesByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Courses is invalid'
    });
  }

  Courses.findById(id).populate('user', 'displayName').exec(function (err, courses) {
    if (err) {
      return next(err);
    } else if (!courses) {
      return res.status(404).send({
        message: 'No courses with that identifier has been found'
      });
    }
    req.courses = courses;
    next();
  });
};
