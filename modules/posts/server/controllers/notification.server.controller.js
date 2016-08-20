'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  Notification = mongoose.model('Notification');

exports.getOldNoti = function (limit,cb) {
  Notification.find()
    .sort('-created')
    .limit(limit)
    .exec(function(err, docs){
      cb(err, docs);
    });
}

exports.saveNoti = function (data,cb){
  var newNoti = new Notification({
    msg: "đã cmt vào "+ data.msg
  });
  newNoti.save(function(err){
    cb(err);
  });
}
