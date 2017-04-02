videoApp.service('$moviesService', function ($http) {
  this.getMoviesInfo = function() {
    var moviesPromise = $http.get('https://demo2697834.mockable.io/movies').then(function(data) {
      return data.data.entries;
    }, function() {
      console.log("Error getting movies data");
    });
    return moviesPromise;
  },
  this.getMoviesHistory = function() {
    var moviesHistoryPromise = $http.get('/history').then(function(data) {
      return data.data;
    }, function() {
      console.log("Error getting movies history data");
    });
    return moviesHistoryPromise;
  }
});
