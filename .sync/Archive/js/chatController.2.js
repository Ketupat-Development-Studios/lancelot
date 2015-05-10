
freelance.controller("chatCtrl", ["$scope","$http","$location", function($scope, $http, $routeParams, $location){
  console.log("yo", $routeParams);
  fetchMessages($routeParams)
  $scope.msg = getChat
}])