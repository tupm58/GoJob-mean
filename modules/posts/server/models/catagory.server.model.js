'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title: {
    type: String
  },
  menuKey: {
    type: String
  }
});


mongoose.model('Category', CategorySchema);
