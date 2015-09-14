'use strict';

angular.module('test3App')
  .controller('MainCtrl', ['$scope','$http', 'socket', 'YoutubeService', function($scope, $http, socket, YoutubeService) {

    $scope.searchTerm = '';
    $scope.videos = [];


    $scope.search = function() {
        /*
        $http.post('/api/search/', { search: $scope.searchTerm }).then(function(response) {
            $scope.results = response.data.items;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });
        */
        YoutubeService.getYoutubeFeed(20,  $scope.searchTerm).then(function (data) {
            $scope.videos = data.items;
            $scope.showLoading = false;
            $scope.showLoadingFancy = false;
        });
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }]);
