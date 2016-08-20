'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * Message Schema
 */
var MessageSchema = new Schema({
  sendId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  receiveId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  seen: {
    type: Boolean,
    default: false
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('Message', MessageSchema);
