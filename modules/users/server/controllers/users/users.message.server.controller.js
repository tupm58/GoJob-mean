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
  Message = mongoose.model('Message');

exports.message = function (req, res) {
  var user = req.user;
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  var id = req.params.id;
  var time = req.query.time;
  if (user) {
    User.findOne({_id: id}).exec(function (err, receiver) {
      if (err) {
        return res.status(400).send(err);
      }
      if (receiver) {
        var query = {
          $or: [
            {sendId: receiver._id, receiveId: user._id},
            {receiveId: receiver._id, sendId: user._id}
          ]
        }
        if (time){
          query.created = {
            $lt: new Date(time)
          };
        }
        console.log(query);
        Message.find(query)
          .limit(10)
          .sort({created: -1})
          .exec(function (err, messages) {
            if (err) {
              return res.status(400).send(err);
            } else {
              res.json({
                receiver: receiver,
                messages: messages
              });
            }
          });
      } else {
        res.status(400).send({
          message: 'User not found'
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.messageHistory = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  var id = req.params.id;
  if (user) {

    var cursor = Message.aggregate(
      [
        {$match: {sendId: user._id}},
        {$group: {_id: "$receiveId"}},
        {$sort: {created: -1}},
        {$limit: 100},
        {$skip: 0}
      ],
      function (err, values) {
        var query = values.map(function (value) {
          return value._id;
        });
        User.find({_id: {$in: query}},
          '_id displayName username created profileImageURL '
        ).exec(function (err, users) {
          res.json(users);
        });
      }
    )
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
