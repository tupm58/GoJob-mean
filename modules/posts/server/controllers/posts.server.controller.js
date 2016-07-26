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
exports.create = function(req, res) {
  var post = new Post(req.body);
  post.user = req.user;
  //post.postImageURL = "";
  var upload = multer(config.uploads.postUpload).single('newPostPicture');
  var postUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  upload.fileFilter = postUploadFileFilter;

  upload(req, res,function (uploadError) {
    if (uploadError){
      return res.status(400).send({
        message: 'Error occurred while uploading profile picture'
      });
    }else{
      console.log("day la " + req.file.filename);
      post.postImageURL = config.uploads.postUpload.dest + req.file.filename;
      console.log("day la 1 " + post.postImageURL);
      console.log("1"+post);
      post.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(post);
        }
      });
    }
  });



  // fs.readFile(file.path,function (err, original_data) {
  //   if(err){
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   }
  //   // save image in db as base64 encoded - this limits the image size
  //   // to there should be size checks here and in client
  //   var base64Image = original_data.toString('base64');
  //   fs.unlink(file.path, function (err) {
  //     if (err)
  //     {
  //       console.log('failed to delete ' + file.path);
  //     }
  //     else{
  //       console.log('successfully deleted ' + file.path);
  //     }
  //   });
  // });
  // post.postImageURL = base64Image;


};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var post = req.post ? req.post.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  post.isCurrentUserOwner = req.user && post.user && post.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(post);
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
  var post = req.post ;

  post = _.extend(post , req.body);

  post.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(post);
    }
  });
};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {
  var post = req.post ;

  post.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(post);
    }
  });
};

/**
 * List of Posts
 */
exports.list = function(req, res) {
  Post.find().sort('-created').populate('user', 'displayName').exec(function(err, posts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(posts);
    }
  });
};

/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Post is invalid'
    });
  }

  Post.findById(id).populate('user', 'displayName').exec(function (err, post) {
    if (err) {
      return next(err);
    } else if (!post) {
      return res.status(404).send({
        message: 'No Post with that identifier has been found'
      });
    }
    req.post = post;
    next();
  });
};
