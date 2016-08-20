'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket', '$http',
  function ($scope, $location, Authentication, Socket, $http) {
    // Create a messages array
    $scope.messages = [];
    $scope.listMemberOnline = [];
    $scope.historyMessage = [];
    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }
    Socket.emit('joinedSuccess');


    $scope.notMe = function(member){
      return member._id != user._id;
    }
    //Receive Member
    Socket.on('listMember', function (data) {
      console.log(data);
      $scope.listMemberOnline = data.listMember.filter(function (value) {
        var temp = value;
        delete temp.$$hashKey;
        if (temp === window.user) {
          return false;
        }
        return value;
      });
    });

    //get message history
    $http.get('/api/users/messageHistory')
      .success(function(values){
        $scope.historyMessage = values;
      })
      .error(function(err){
        console.log(err)
      })

    //not online
    $scope.notOnline = function(member){
      var kq = true;
      $scope.listMemberOnline.map(function(value){
        if(value._id == member._id) kq =false;
      });
      return kq;
    }
  }
]);
