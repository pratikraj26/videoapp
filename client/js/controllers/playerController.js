videoApp
.controller('playerController', ['$scope', '$http', 'video', '$routeParams', '$moviesService',
function playerController($scope, $http, video, $routeParams, $moviesService) {
  $moviesService.getMoviesInfo().then(function (data) {
    $scope.film = data[$routeParams.index];
    video.addSource('mp4', $scope.film.contents[0].url);

    $http.post("/history", JSON.stringify($scope.film)).then(function() {
      console.log("Post request success.");
    }, function() {
      console.log("Post request error");
    });
  })
}]);
