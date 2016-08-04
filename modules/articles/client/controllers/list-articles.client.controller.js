(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService', 'Authentication', 'Socket'];

  function ArticlesListController(ArticlesService, Authentication, Socket) {
    var vm = this;

    vm.error = null;
    vm.articles = ArticlesService.query();

    // Make sure the Socket is connected
    if (!Socket.socket && Authentication.user) {
      Socket.connect();
    }

    Socket.on('articleCreateError', function (response) {
      vm.error = response.message;
    });

    Socket.on('articleCreateSuccess', function (response) {
      if (vm.articles) {
        vm.articles.unshift(response.data);
      }
    });

    Socket.on('articleUpdateSuccess', function (response) {
      if (vm.articles) {
        // not the most elegant way to reload the data, but hey :)
        vm.articles = ArticlesService.query();
      }
    });
  }
})();
