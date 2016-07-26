(function () {
  'use strict';

  // Posts controller
  angular
    .module('posts')
    .controller('PostsController', PostsController);

  PostsController.$inject = ['$scope', '$state', 'Authentication', 'postResolve','FileUploader'];

  function PostsController ($scope, $state, Authentication, post,FileUploader) {
    var vm = this;

    vm.authentication = Authentication;
    vm.post = post;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.imageURL = vm.post.postImageURL;
  //  vm.uploadProfilePicture = uploadProfilePicture;
    vm.cancelUpload = cancelUpload;
    vm.uploader = new FileUploader({
      url: 'api/posts',
      alias: 'newPostPicture'
    });
    // Change user profile picture
    function uploadProfilePicture() {
      // Clear messages
      vm.success = vm.error = null;

      // Start upload
      vm.uploader.uploadAll();
    }

    // Cancel the upload process
    function cancelUpload() {
      vm.uploader.clearQueue();
      vm.imageURL = vm.user.profileImageURL;
    }
    // Remove existing Post
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.post.$remove($state.go('posts.list'));
      }
    }

    // Save Post
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.postForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.post._id) {
        vm.post.$update(successCallback, errorCallback);
      } else {
        vm.post.$save(successCallback, errorCallback);
        uploadProfilePicture();
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
