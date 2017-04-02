videoApp
.controller('landingController', ['$scope', '$http', 'video', '$rootScope', '$location', '$moviesService', '$window',
function landingController($scope, $http, video, $rootScope, $location, $moviesService, $window) {

  $scope.slides = [];
  $scope.isLoaded = false;

  $moviesService.getMoviesInfo().then(function(data) {
    angular.forEach(data, function(d, key) {
      $scope.slides.push({
        url: d.images[0].url,
        id: d.id,
        index: key,
        title: d.title
      });
    });

    $scope.ctrl = {
      autoplay : {
        slides: $scope.slides
      }
    }
    $scope.ctrl.number = 6;

    if($window.innerWidth > 1300) {
      $scope.ctrl.number = 6;
    } else if($window.innerWidth > 1024 && $window.innerWidth < 1300) {
      $scope.ctrl.number = 5;
    } else if($window.innerWidth > 768 && $window.innerWidth < 1024) {
      $scope.ctrl.number = 4;
    } else {
      $scope.ctrl.number = 3;
    }

    $scope.isLoaded = true;
  });


  $scope.playmovie = function(movieId, index) {
    $location.url('/player/'+ movieId + '/'+ index);
  }
}]);
