
freelance.controller("chatCtrl", ["$scope","$http","$location", function($scope, $http, $routeParams, $location){
  console.log("yo", $routeParams.chatid);
  
  $scope.msg = fetchMessages($routeParams.chatid)
}])