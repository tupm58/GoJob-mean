(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', '$timeout', 'articleResolve', 'Authentication', 'Socket'];

  function ArticlesController($scope, $state, $timeout, article, Authentication, Socket) {
    var vm = this;

    vm.article = article;
    //vm.isNew = vm.article._id;
    vm.authentication = Authentication;
    vm.error = null;
    vm.message = null;
    //vm.isUpdating = $scope.isUpdating;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.saveUsingSocketEvents = saveUsingSocketEvents;

    // Make sure the Socket is connected
    if (!Socket.socket && Authentication.user) {
      Socket.connect();
    }

    Socket.on('articleUpdateError', function (response) {
      vm.error = response.message;
      $scope.isUpdating = false;
      //TODO: Use ng-messages
    });

    Socket.on('articleUpdateSuccess', function (response) {
      if (vm.article && vm.article._id.toString() === response.data._id) {
        vm.article = response.data;
        vm.message = response.message;
        $scope.isUpdating = false;
      }
    });

    // Create new Article using SocketIO events
    function saveUsingSocketEvents(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');
        return false;
      }

      // we can send the user back to the articles list already
      if (!vm.article._id) {
        $state.go('articles.list');
      }

      // wait to send create request so we can create a smooth transition
      $timeout(function () {
        // TODO: move create/update logic to service
        if (vm.article._id) {
          Socket.emit('articleUpdate', vm.article);
          $scope.isUpdating = true;
        } else {
          Socket.emit('articleCreate', vm.article);
        }        
      }, 2000);
    }

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.article._id) {
        vm.article.$update(successCallback, errorCallback);
      } else {
        vm.article.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('articles.view', {
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
