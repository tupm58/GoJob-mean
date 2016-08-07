'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
/**
 * Post Schema
 */

var PostSchema = new Schema({
  title: {
    type: String
  },
  postContent: {
    type: String,
    default: '',
    required: 'Please fill Post',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  postImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  comments: [{
    commentContent: String,
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  }],
  tags: [{
    word: String
  }]
});
PostSchema.index({'tags.word': 'text'});

mongoose.model('Post', PostSchema);

