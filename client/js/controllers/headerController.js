videoApp
.controller('headerController', ['$scope', '$http', '$location', '$window', function headerController($scope, $http, $location,$window) {
  $scope.navitem1 = "Home";
  $scope.navitem2 = "History";

  $scope.goHome = function() {
    $location.url('/home');
  }

  $scope.getMoviesHistory = function() {
    $location.url('/history');
  }
}]);
