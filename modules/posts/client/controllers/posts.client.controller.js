(function () {
  'use strict';

  // Posts controller
  angular
    .module('posts')
    .controller('PostsController', PostsController);

  PostsController.$inject = ['$scope', '$state', 'Authentication', 'postResolve','FileUploader','Socket','$timeout'];

  function PostsController ($scope, $state, Authentication, post,FileUploader,Socket,$timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.post = post;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.imageURL = vm.post.postImageURL;
    vm.uploadProfilePicture = uploadProfilePicture;
    vm.cancelUpload = cancelUpload;
    vm.uploader = new FileUploader({
      url: 'api/posts',
      alias: 'newPostPicture' || null,
      formData : [vm.post]
    });
    if (!Socket.socket && Authentication.user) {
      Socket.connect();
      console.log("connect");
    }
    // Change user profile picture
    function uploadProfilePicture() {
      vm.success = vm.error = null;
      // Start upload
      vm.uploader.uploadAll();
     // Socket.emit('postCreate',vm.post);
    }
    //START
    Socket.on('post.created', function(post) {
      console.log(post);
    });
    //END
    
    // Cancel the upload process
    function cancelUpload() {
      vm.uploader.clearQueue();
      vm.imageURL = vm.post.postImageURL;
    }
    // Remove existing Post
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.post.$remove($state.go('posts.list'));
      }
    }

    // Save Post
    function save(isValid) {
      console.log(vm.post);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.postForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.post._id) {
        vm.post.$update(successCallback, errorCallback);
      } else {
        //uploadProfilePicture();
        vm.uploader.uploadAll();
        console.log(vm.imageURL);
        vm.post.$save(successCallback, errorCallback);
      }
      function successCallback(res) {
        $state.go('posts.view', {
          postId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }


    }
  }
})();
