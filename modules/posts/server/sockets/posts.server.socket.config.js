'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),

  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Post
 */
module.exports = function (io,socket) {
  socket.on('postCreate',function (post) {
    var user = socket.request.user;

    post = new Post(post);
    post.user = user;

    post.save(function (err) {
      if (err) {
        // Emit an error response event
        io.emit('postCreateError', { data: post, message: errorHandler.getErrorMessage(err) });
      } else {
        // Emit a success response event
        io.emit('postCreateSuccess', { data: post, message: 'post created' });
      }
    });
  });

}
