
freelance.controller("chatCtrl", ["$scope","$http","$location", function($scope, $http, $routeParams, $location){
  fetchMessages($routeParams)
  $scope.msg = getChat
}])