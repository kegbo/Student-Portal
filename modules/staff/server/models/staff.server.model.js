'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Staff Schema
 */
var StaffSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  staffnum: {
    type: Number,
    default: '',
    trim: true,
    required: 'FirstNmae cannot be blank'
  },
  firstname: {
    type: String,
    default: '',
    trim: true,
    required: 'FirstNmae cannot be blank'
  },
  lastname: {
    type: String,
    default: '',
    trim: true,
    required: 'LastName cannot be blank'
  },
  position: {
    type: String,
    default: '',
    trim: true,
    required: 'Position cannot be blank'
  },
  phoneNumber: {
    type: Number,
    default: '',
    trim: true,
    required: 'Phone Number cannot be blank'
  },
  department: {
    type: String,
    default: '',
    trim: true,
    required: 'department cannot be blank'
  },
  faculty: {
    type: String,
    default: '',
    trim: true,
    required: 'Faculty cannot be blank'
  },
  courses: {
    type: String,
    default: '',
    trim: true,    
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Staff', StaffSchema);
