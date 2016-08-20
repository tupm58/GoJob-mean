'use strict';
var mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  User = mongoose.model('User'),
  ObjectId = mongoose.Schema.Types.ObjectId;
// Create the chat configuration
var connectedMember = [];
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  // io.emit('connected',{
  //   type: 'status',
  //   text: 'Is now connected',
  //   created: Date.now(),
  //   profileImageURL: socket.request.user.profileImageURL,
  //   username: socket.request.user.username
  // });

  io.emit('joined', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  socket.on('joinedSuccess', function () {
    connectedMember = connectedMember.filter(function(value){
      if(value === socket.request.user){
        return false;
      }
      return value;
    });
    connectedMember.push(socket.request.user);
    io.emit('listMember',{
      listMember: connectedMember
    });
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
    connectedMember = connectedMember.filter(function(value){
      if(value === socket.request.user){
        return false;
      }
      return value;
    });
    io.emit('listMember',{
      listMember: connectedMember
    });
  });

  //send private message
  socket.on('privateMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.sender = socket.userId;
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;
    console.log(socket.request.user.socketId);
    console.log(socket.userId);
    for(let temp in io.clients().sockets) {
      if (message.receiver == io.clients().sockets[temp].userId) {
        io.clients().sockets[temp].emit('chatMessage', message);
        io.clients().sockets[temp].emit('privateMessage', message);
        console.log("1- emit " + message);

      }
    }
    saveMessage(message, socket.request.user._id);
    socket.emit('chatMessage', message);
    console.log("2- emit " + message);
    // Emit the 'chatMessage' event
  });
};
function saveMessage(message, sendId){
  User.findOne({_id: sendId},function(err, user){
    if(err) {
      console.log('user error');
      console.log(err);
    }
    if(user){
      var mess = new Message({
        sendId: sendId,
        receiveId: message.receiver,
        content: message.text
      });
      mess.save(function(err, content){
        if(err) console.log(err);
          console.log(content);
      });
    }
  });
}
