(function () {
  'use strict';

  angular
    .module('posts')
    .controller('PostsListController', PostsListController);

  PostsListController.$inject = ['PostsService','Authentication','Socket'];

  function PostsListController(PostsService,Authentication,Socket) {
    var vm = this;

    vm.posts = PostsService.query();

    if (!Socket.socket && Authentication.user) {
      Socket.connect();
    }
    Socket.on('post.created', function(post) {
      console.log(post);
    });
    Socket.on('comment.created', function(post) {
      console.log(post);
    });
    Socket.on('postCreateError', function (response) {
      vm.error = response.message;
    });

    Socket.on('postCreateSuccess', function (response) {
      if (vm.posts) {
        console.log("scoket!!!");
        // not the most elegant way to reload the data, but hey :)
        vm.posts = PostsService.query();
      }
    });
  }
})();
