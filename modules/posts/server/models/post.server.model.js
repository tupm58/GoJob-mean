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
    // required: 'Title cannot be blank'
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
    default: ''
  },
  comments: [{
    commentContent: String,
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  }],
  tags: [{
    word: {
      type: String,
      default: ''
    }
  }],
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  }
});
PostSchema.index({'tags.word': 'text'});

mongoose.model('Post', PostSchema);

