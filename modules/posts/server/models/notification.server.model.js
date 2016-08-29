'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  content: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  postId: {
    type: Schema.ObjectId,
    ref: 'Post'
  },
  receiveIds: [{
    receiveId: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    seen: {
      type: Boolean,
      default: false
    }
  }]
});


mongoose.model('Notification', NotificationSchema);
