(function () {
  'use strict';

  angular
    .module('chat.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        controller: 'ChatController',
        // controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Chat'
        }
      })
      .state('chat.private', {
        url: '/:id',
        templateUrl: 'modules/chat/client/views/chatPrivate.client.view.html',
        data: {
          roles: ['user', 'admin']
        },
        controller: 'ChatPrivateController'
      });
  }
}());
