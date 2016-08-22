'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Notification = mongoose.model('Notification');

exports.getOldNoti = function (limit,cb) {
  Notification.find()
    .sort('-created')
    .limit(limit)
    .exec(function(err, docs){
      cb(err, docs);
    });
}

// exports.saveNoti = function (data,cb){
//   var newNoti = new Notification({
//     msg: "đã cmt vào "+ data.msg
//   });
//   newNoti.save(function(err){
//     cb(err);
//   });
// }
exports.saveNoti = function(notification,sendId){
  User.findOne({_id: sendId},function(err,user){
    if (err){
      console.log("user error"+err);
    }
    if (user){
      var noti = new Notification({
        sendId: sendId,
        content: notification.text
      });
      noti.receiveIds.push(notification.receiveId);
      noti.save(function (err, content) {
        if (err){
          console.log(err);
        }else{
          console.log(content);
        }
      })
    }
  });
}
