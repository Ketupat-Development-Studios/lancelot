


freelance.controller("chatCtrl",  function($rootScope, $scope, $http, $routeParams, $filter, $location){
  console.log("yo", $routeParams.chatid);
  function fetchMessages(chatid){
	  {
	  	123: [
	  		{guy: $filter($rootScope.chats, {id: "123"})[0], contents: "fuck you"},
	  		{guy: $filter($rootScope.chats, {id: "420"})[0], contents: "fuck you too"}
	  	]
	  }[chatid];
	}
  $http.post(apiURL,{
    'query': 'getlancersbycat',
    'id'   : $scope.curCatId
  }, config).success(function(response){
    console.log(response)
    $scope.allJobs = response
  })
}
  $scope.msg = fetchMessages($routeParams.chatid)
})