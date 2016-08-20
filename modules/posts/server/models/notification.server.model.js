'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  msg: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  seen: {
    type: Boolean,
    default: false
  },
  to :{
    type: Schema.ObjectId,
    ref: 'User'
  }
});


mongoose.model('Notification', NotificationSchema);
