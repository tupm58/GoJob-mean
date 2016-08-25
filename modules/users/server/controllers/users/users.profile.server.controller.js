'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // For security measurement do not use _id from the req.body object
  delete req.body._id;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now;
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;
  if (user) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;
        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
exports.userDetail = function (req,res){
  var username = req.params.username;
  var userId = req.params.userId;

  User.findOne({
    // username: username
      $or:[
        {username: username},
        {_id: userId}
      ]
  }, '_id displayName username created profileImageURL ')
    .exec(function(err, user) {
    if (err){
      console.log(err);
    }else{
      res.json(user);
    }
  });
};
/*
 * user middleware
 * */
exports.userByUsername = function(req, res, next, username) {
  User.findOne({
    username: username
  }, '_id displayName username created profileImageURL ')
    .exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + username));
    req.user = user;
    next();
  });
};
exports.findUser = function(req,res){
  var textSearch = req.body.textSearch;
  var limit = req.body.limit || 10;
  var skip = req.body.skip || 0;
  var user = req.user;
  if(!textSearch) return res.json([]);
  var query = new RegExp(textSearch, 'i');
  User.find({
      // _id: {'$ne': user._id},
      $or: [
        { firstName: query },
        { lastName: query },
        { displayName: query }
      ]
    },'_id displayName username created profileImageURL ')
    .limit(limit).skip(skip)
    .exec(function(err, ids){
      console.log(ids);
      res.json(ids);
    })
};
