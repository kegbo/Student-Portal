'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Student name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  course: [{
        type: Schema.ObjectId,
        ref: 'Course'       
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Student', StudentSchema);
