'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  db = require('../controllers/chat.server.controller');
// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  io.emit('chatMessage', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    db.getOldMsgs(5,function (err, docs) {
      io.emit('load old msgs',docs);
      console.log(docs);
    });
    
    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
    db.saveMsg({
      content: message.text,
      user :  socket.request.user
    },function(err){
    });

  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      username: socket.request.user.username
    });
  });
};
