'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  app.route('/api/users/detail/:username').get(users.userDetail);
  app.route('/api/users/details/:userId').get(users.userDetail);

  app.route('/api/users/message/:id').get(users.message);
  app.route('/api/users/messageHistory').get(users.messageHistory);
  app.route('/api/users/notification/:id').get(users.notification);

  app.route('/api/users/find').post(users.findUser);


  // Finish by binding the user middleware
  app.param('userId', users.userByID);
  app.param('username', users.userByUsername);

};
