'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message');

exports.getOldMsgs = function (limit,cb) {
  Message.find()
    .sort('-created')
    .limit(limit)
    .exec(function(err, docs){
      cb(err, docs);
    });
}

exports.saveMsg = function (data,cb){
  var newMsg = new Message({
    content: data.content,
    user : data.user
  });
  newMsg.save(function(err){
    cb(err);
  });
}
