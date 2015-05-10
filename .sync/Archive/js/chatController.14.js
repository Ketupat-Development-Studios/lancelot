


freelance.controller("chatCtrl",  ["$rootScope","$scope","$http","$routeParams","$location",function($rootScope, $scope, $http, $routeParams, $location){
  console.log("yo", $routeParams.chatid, $routeParams);
  function fetchMessages(chatid){
  	getShit = function(guyid){
  		return $rootScope.chats.reduce(function(a, b){if(b.id == guyid) return b; else return a;}, {name:"suspicious guy"});
  	}
	return {
		123: [
			{guy: getShit("123"), contents: "fuck you"},
			{guy: getShit("420"), contents: "fuck you too"},
			{guy: getShit("123"), contents: "fuck you"},
			{guy: getShit("420"), contents: "fuck you too"},
			{guy: getShit("123"), contents: "fuck you"},
			{guy: getShit("420"), contents: "fuck you too"}
		]
	}[chatid];
  }/*
  $http.post(apiURL,{
    'query': 'getlancersbycat',
    'id'   : $scope.curCatId
  }, config).success(function(response){
    console.log(response)
    $scope.allJobs = response
  })*/
  $scope.msg = fetchMessages($routeParams.chatid)
}])