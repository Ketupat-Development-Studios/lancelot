angular.module('selectDemoOptionsAsync', ['ngMaterial'])
.controller('SelectAsyncController', function($timeout, $scope) {
  $scope.loadUsers = function() {
    // Use timeout to simulate a 650ms request.
    $scope.users = [];
    console
    return $timeout(function() {
      $scope.users = [
        { id: 1, name: 'Plumbing' },
        { id: 2, name: 'Electricians' },
        { id: 3, name: 'Mario' },
        { id: 4, name: 'Funk' },
        { id: 5, name: 'You up' },
      ];
    }, 650);
  };
});

console.log("yo")