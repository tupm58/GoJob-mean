'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Notification = mongoose.model('Notification');

exports.notification = function(req,res){
  var user = req.user;
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  var id = req.params.id;
  if (user){
    User.findOne({_id: id}).exec(function(err,receiver){
      if (err){
        return res.status(400).send(err);
      }
      if(receiver){
        Notification.aggregate([
          {$match: { 'receiveIds._id':{ $gte:receiver._id} }},
          {$project: {
            content : '$content',
          }}

        ])
          .limit(30)
          .sort({created:-1})
          .exec(function(err,notifications){
            if(err){
              return res.status(400).send(err);
            }else{
              res.json({
                receiver: receiver,
                notifications: notifications
              });
            }
          });
      }else{
        res.status(400).send({
          message: 'User not found'
        });
      }
    });
  }else{
    res.status(400).send({
      message: 'User is not signed in'
    });
  }

}

