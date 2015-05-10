freelance.controller('SelectAsyncController', function($timeout, $scope) {
  $scope.whatFucks = function(searchText) {
    // Use timeout to simulate a 650ms request.
    $scope.users = [];
    console.log("hey", searchText)
    /*return $timeout(function() {
      $scope.users = [
        { id: 1, name: 'Plumbing' },
        { id: 2, name: 'Electricians' },
        { id: 3, name: 'Mario' },
        { id: 4, name: 'Funk' },
        { id: 5, name: 'You up' },
      ];
    }, 650);*/
    return $q(function(resolve, reject){
      $http.post(apiURL,{
        'query'      :'searchcats',
        'searchquery': searchText
      }, config).success(function(response){
        console.log(response);
        resolve(response);
      }).failure(function(){
        reject("oh shit");
      });
  };
});

console.log("yo")