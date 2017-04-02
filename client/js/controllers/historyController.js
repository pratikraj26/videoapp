videoApp
.controller('historyController', ['$scope', '$moviesService',
function historyController($scope, $moviesService) {

  $scope.slides = [];

   $moviesService.getMoviesHistory().then(function(data) {
     angular.forEach(data, function(d, key) {
       $scope.slides.push(d);
     });
   });

}]);
