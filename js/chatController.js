freelance.controller("chatCtrl",  ["$rootScope","$scope","$http","$routeParams","$location",function($rootScope, $scope, $http, $routeParams, $location){
  console.log("yo", $routeParams.chatid);
  x = $routeParams;
  function fetchMessages(chatid){
  	getShit = function(guyid){
  		return $rootScope.chats.reduce(function(a, b){if(b.id == guyid) return b; else return a;}, {name:"suspicious guy"});
  	}
	return {
		123: [
      {guy: getShit("420"), contents: "hi, i have an issue, my toilet appears to be clogged"},
			{guy: getShit("123"), contents: "is it ponding?"},
			{guy: getShit("420"), contents: "yes my house looks like orchard road"},
      {guy: getShit("123"), contents: "ahhh yes can do I fixed orchard road"},
      {guy: getShit("123"), contents: "do you have mushrooms btw?"},
			{guy: getShit("420"), contents: "yes I have shiitake mushrooms"},
			{guy: getShit("123"), contents: "good I come in 2 mins"},
			{guy: getShit("420"), contents: "kthnxbai"}
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
  $scope.messages = fetchMessages($routeParams.chatid)
}])