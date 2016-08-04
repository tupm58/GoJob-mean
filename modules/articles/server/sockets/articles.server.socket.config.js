'use strict';

var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

// Create the articles configuration
module.exports = function (io, socket) {

  // Create an Article, and then emit the response back to all connected clients.
  socket.on('articleCreate', function (article) {
    var user = socket.request.user;

    article = new Article(article);
    article.user = user;

    article.save(function (err) {
      if (err) {
        // Emit an error response event
        io.emit('articleCreateError', { data: article, message: errorHandler.getErrorMessage(err) });
      } else {
        // Emit a success response event
        io.emit('articleCreateSuccess', { data: article, message: 'Article created' });
      }
    });
  });

  // Update an Article, and then emit the response back to all connected clients.
  socket.on('articleUpdate', function (data) {
    var user = socket.request.user;

    // Find the Article to update
    Article.findById(data._id).populate('user', 'displayName').exec(function (err, article) {
      if (err) {
        // Emit an error response event
        io.emit('articleUpdateError', { data: data, message: errorHandler.getErrorMessage(err) });
      } else if (!article) {
        // Emit an error response event
        io.emit('articleUpdateError', { data: data, message: 'No article with that identifier has been found' });
      } else {
        article.title = data.title;
        article.content = data.content;
        
        article.save(function (err) {
          if (err) {
            // Emit an error response event
            io.emit('articleUpdateError', { data: data, message: errorHandler.getErrorMessage(err) });
          } else {
            // Emit a success response event
            io.emit('articleUpdateSuccess', { data: article, updatedBy: user.displayName, updatedAt: new Date(Date.now()).toLocaleString(), message: 'Updated' });
          }
        });
      }
    });
  });
};
