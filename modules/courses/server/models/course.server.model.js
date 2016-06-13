'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Course title',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  staff: [{
        type: Schema.ObjectId,
        ref: 'Staff'       
  }],
  student: [{
        type: Schema.ObjectId,
        ref: 'Student'       
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Course', CourseSchema);
