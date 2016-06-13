'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Staff Schema
 */
 /*var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
*/
var StaffSchema = new Schema({
  firstname: {
    type: String,
    default: '',
    required: 'Please fill First name',
    trim: true
  },
 /* lastname: {
    type: String,
    default: '',
    required: 'Please fill Last name',
    trim: true
  },
  middlename: {
    type: String,
    default: '',
    trim: true
  },
  nationality: {
    type: String,
    default: '',
    required: 'Please fill Nationality',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill email',
    trim: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  hometel: {
    type: Number,
    default: '',
    trim: true
  },
  offtel: {
    type: Number,
    default: '',
    trim: true
  },
  mobtel: {
    type: Number,
    default: '',
    required: 'Please provide a phone Number',
    trim: true
  },
  address: {
        stradd: {
        type: String,
        default: '',
        required: 'Please fill  a Street address',
        trim: true
      },
      city: {
        type: String,
        default: '',
        required: 'Please provide a city',
        trim: true
      },
      state: {
        type: String,
        default: '',
        required: 'Please provide a state',
        trim: true
      },
      postcode: {
        type: String,
        default: '',
        required: 'Please provide a postcode',
        trim: true
      },
      country: {
        type: String,
        default: '',
        required: 'Please provide a country',
        trim: true
      }
  },*/
  courses: [{
        type: Schema.ObjectId,
        ref: 'Course'       
  }]
  ,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Staff', StaffSchema);
