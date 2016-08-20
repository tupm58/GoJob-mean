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
  Notification = mongoose.model('Notification'),
  Category = mongoose.model('Category'),
  db = require('../controllers/notification.server.controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a Post
 */
exports.create = function(req, res) {

  var upload = multer(config.uploads.postUpload).single('newPostPicture');
  var postUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  upload.fileFilter = postUploadFileFilter;

  upload(req, res,function (uploadError) {
    var post = new Post(req.body);
    post.user = req.user;

    if (uploadError){
      return res.status(400).send({
        message: 'Error occurred while uploading profile picture'
      });
    }else{
      if (req.file){
        post.postImageURL = config.uploads.postUpload.dest + req.file.filename;
        post.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var socketio = req.app.get('socketio');
            socketio.sockets.emit('post.created',post);

            res.jsonp(post);
          }
        });
      }else {
        post.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            var socketio = req.app.get('socketio');
            socketio.sockets.emit('post.created',post);
            res.jsonp(post);
          }
        });
      }
    }
  });
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
  Post.find().sort('-created')
    .populate('category')
    .populate('user', 'displayName').exec(function(err, posts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(posts);
    }
  });
};

// create Comment
exports.createComment = function (req,res) {
  var postId = req.params.postId;
  var comment = req.body;
  comment.user = req.user;

  Post.findById(postId,function (err,post) {
    post.comments.push(comment);
    post.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var msg = comment.user.displayName + " da comment vao post: " + post.postContent;
        var noti = new Notification({msg : msg});
        noti.save(function (err) {
          if (err){

          }else{
            var users = [];

            // var socketio = req.app.get('socketio');
            // console.log(noti);
            // socketio.sockets.emit('comment.created',noti);
            socketio.on('connection',function(socket){
              socket.broadcast.to().emit('comment.created',noti);
            });
          }
        });
        res.jsonp(post);
      }
    });
  })
};


//search post by tag
exports.listPostByTag = function (req, res) {

  var tag = req.params.tag;
  console.log(tag);
  Post.find({$text: {$search: tag }})
    .sort('-created')
    .populate('category')
    .populate('user', 'displayName')
    .exec(function(err,posts){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(posts);
      }
    });
}

//query post by category
exports.listPostByCategory = function(req,res){
  var categoryId = req.params.categoryId;
  Post.find({category : categoryId})
    .sort('-created')
    .populate('category')
    .populate('user', 'displayName').exec(function(err, posts) {
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

  Post.findById(id)
    .populate('category')
    .populate('user', 'displayName').exec(function (err, post) {
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

//create category
exports.createCategory = function (req,res){
  var category = new Category(req.body);
  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};

exports.listCategory = function (req, res) {
  Category.find().sort('-created').exec(function(err, posts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(posts);
    }
  });
};

exports.deleteCategory = function(req,res){
  var category = req.category ;

  category.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(category);
    }
  });
};
exports.categoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'category is invalid'
    });
  }

  Category.findById(id).exec(function (err, category) {
    if (err) {
      return next(err);
    } else if (!category) {
      return res.status(404).send({
        message: 'No Post with that identifier has been found'
      });
    }
    req.category = category;
    next();
  });
};
//get list user comment
exports.getUserComment = function (req,res){
  var postId = req.params.postId;
  Post.findById(postId)
    .populate('comments.user','displayName').exec(function (err, post) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var data=[];
      for (var i = 0; i < post.comments.length ;i++){
        data.push(post.comments[i].user);
      }
      res.jsonp(data);
     // console.log(data);
    }
  })
}
