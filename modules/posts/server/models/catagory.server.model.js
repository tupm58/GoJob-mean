'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title: {
    type: String,
    required: 'Title cannot be blank'
  }
});


mongoose.model('Category', CategorySchema);
