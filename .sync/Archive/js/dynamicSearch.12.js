freelance.controller('SelectAsyncController', function($timeout, $q, $scope) {
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

    var deffered = $q.defer();
    $http.post(apiURL,{
      'query'      :'searchcats',
      'searchquery': searchText
    }, config).success(function(response){
      deffered.resolve(response);
    });
    return deffered.promise;
  };
});

console.log("yo")