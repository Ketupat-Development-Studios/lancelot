Array.prototype.chunk = function (groupsize) {
  var sets = [];
  var chunks = this.length / groupsize;
  for (var i = 0, j = 0; i < chunks; i++, j += groupsize) {
    sets[i] = this.slice(j, j + groupsize);
  }
  return sets;
};


apiURL = "http://lancelot.ketupat.me/php/api.php"
config = {withCredentials: true}

var freelance = angular.module('freelance', ['ngRoute','ngFx','ngAnimate','ngMaterial','alAngularHero'], 
    function($httpProvider){
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
          value = obj[name];

          if(value instanceof Array) {
            for(i=0; i<value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else if(value instanceof Object) {
            for(subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
freelance.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

// routing lol
freelance.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'loginCtrl',
            title       : 'Welcome'
        })

        .when('/chatwith/:chatid',{
            templateUrl : 'pages/chatwith.html',
            controller  : 'chatCtrl',
            title       : 'Chat yo!'
        })

        .when('/home', { //view categories
            templateUrl : 'pages/cat.html',
            controller  : 'catCtrl',
            title       : 'Explore'
        })

        .when('/view',{ //after selecting category
        	templateUrl : 'pages/view.html',
        	controller  : 'viewCtrl',
        	title       : 'Jobs'
        })

        .when('/hire/:freelance_id', {
        	templateUrl : 'pages/hire.html',
        	controller  : 'hireCtrl',
        	title       : 'Hire Someone'
        })

        .when('/offer', {
        	templateUrl : 'pages/offer.html',
        	controller  : 'offerCtrl',
        	title       : 'Offer Your Services'
        })

        .when('/search/:query', {
          templateUrl : 'pages/results.html',
          controller  : 'searchCtrl',
          title       : 'Search Results'
        })

        .when('/about', {
          templateUrl : 'pages/about.html',
          controller  : 'aboutCtrl',
          title       : 'What is Lancelot?'
        })

        .otherwise({
            redirectTo: '/'
        });;
});

freelance.controller("viewCtrl", ["$scope","$http","$location", function($scope,$http,$location,$rootScope){
  //view after selecting category
  $scope.curCatId = localStorage.getItem("curCatId")
  $scope.curCatName = localStorage.getItem("curCatName")
  $http.post(apiURL,{
    'query': 'getlancersbycat',
    'id'   : $scope.curCatId
  }, config).success(function(response){
    console.log(response)
    $scope.allJobs = response
    angular.forEach($scope.allJobs, function(value,key){
      value.aggregate = (value.friendliness_rating + value.price_rating + value.quality_rating)/3
      value.aggregate = Math.round(value.aggregate)
      if(value.aggregate < 0){value.aggregate = 1}
      console.log(value)
    });
    //all stuff must be done only after response is received
  })
	$scope.getNumber = function(num) {return new Array(num);}
  $scope.goHome = function (){$location.path("/home")}
  $scope.goHireSomeone = function(who){$location.path("/hire/"+who)}
}]);

freelance.controller("loginCtrl", ["$scope","$http","$location",function($scope,$http,$location){
	$location.path("/home");
}])

freelance.controller("offerCtrl", ["$scope","$http","$location", function($scope,$http,$location){
	$scope.offer = {"category":"","name":"","description":"","dp":""}
}])

freelance.controller("catCtrl", ["$scope","$http","$location", function($scope, $http, $location, $rootScope){
  $scope.searchQuery = null
  $scope.allCats = null
  $http.post(apiURL,{
    'query'      :'getcats'
  }, config).success(function(response){
    console.log(response)
    $scope.allCats = response
    //all stuff must be done only after response is received

  })
  $scope.goSearch = function(){
    $http.post(apiURL,{
      'query':'searchlancers',
      'searchquery':$scope.searchQuery
    }, config).success(function(result){
      console.log(result)
      $scope.searchResults = result
    })
  }
  $scope.goToCat = function (cat_id, cat_name) {
    localStorage.setItem("curCatId",cat_id)
    localStorage.setItem("curCatName",cat_name)
    $location.path("/view")
  }
  $scope.goToFlance = function(flance_id){
    $location.path("/hire/"+flance_id)
  }
}])

freelance.controller("hireCtrl", ["$scope","$http","$location","$routeParams", function($scope, $http, $location, $routeParams){
  $scope.freelance_id = $routeParams.freelance_id
  $http.post(apiURL,
  {
    'query':'getlancersbyid',
    'id':$scope.freelance_id
  },config).success(function(response){
    console.log(response)
    var agg = Math.round((response.friendliness_rating + response.price_rating + response.quality_rating)/3)
    $scope.freelance = {
      category:response.cat_name,
      name:response.free_name,
      dp:response.free_image,
      description:response.free_description,
      friendliness:(response.friendliness_rating > 0 ? Math.round(response.friendliness_rating*100)/100 : "NA"),
      price:(response.price_rating > 0 ? Math.round(response.price_rating*100)/100 : "NA"),
      quality:(response.quality_rating > 0 ? Math.round(response.quality_rating*100)/100 : "NA"),
      aggregate:agg,
      reviews:[]
    }
    $http.post(apiURL,{
      'query':'getreviewsbylancer',
      'id':$scope.freelance_id
    }, config).success(function(resp){
      $scope.freelance.reviews = resp
    })
  });
  $scope.goBack = function(){
    $location.path("/view")
  }
}])

freelance.controller('searchCtrl', ["$scope","$location","$http", function($scope, $location, $http){

}])

freelance.controller('LeftCtrl', ["$scope","$timeout","$mdSidenav","$mdUtil","$log","$location","$http", function ($scope, $timeout, $mdSidenav, $mdUtil, $log, $location, $http) {
  $scope.close = function () {
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });
  };
}])

freelance.controller('aboutCtrl', ["$scope", function($scope){
  
}])


freelance.controller('topBarCtrl', ["$scope","$timeout","$mdSidenav","$mdUtil","$log","$location","$http","$rootScope", function($scope, $timeout, $mdSidenav, $mdUtil, $log, $location, $http, $rootScope){
  $scope.toggleLeft = buildToggler('left');
  $rootScope.navBarIsThere = null
  $rootScope.chats = [
    {
      "id"      : "123",
      "name"    : "Mario",
      "service" : "Expert Plumber",
      "dp"      : "mario"
    },
    {
      "id"      : "124",
      "name"    : "Isaac Newton",
      "service" : "Cat Flap Inventor",
      "dp"      : "doge"
    },
    {
      "id"      : "125",
      "name"    : "John Maynard Keynes",
      "service" : "General Philosopher",
      "dp"      : "dalek"
    },
    {
      "id"      : "126",
      "name"    : "Smithlord",
      "service" : "Evil-Doer",
      "dp"      : "pretty"
    },
    {
      "id"      : "420",
      "name"    : "Desmond",
      "service" : "EvilER-Doer",
      "dp"      : "desmond"
    }
  ]

  function buildToggler(navID) {
    var debounceFn =  $mdUtil.debounce(function(){
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
          console.log($rootScope.navBarIsThere)
        },300);
    return debounceFn;
  }
  $scope.goChat = function(id){
    console.log(id);
    location.href = "#/chatwith/" + id;
  }
  $scope.gotoHome = function(){$location.path("/home")}
  $scope.offerYourself = function(){$location.path("/offer")}
}])

freelance.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image'    : 'url(' + url +')',
            'background-size'     : 'cover no-repeat',
            'background-position' : 'center center'
        });
    };
})

/*
freelance.directive('lance-a-lot', function(){
  return {
        restrict:'A',
        link: function (scope, element, attrs) {
            function goLeft(element){
              $(element).animate({"margin-left":"50%"},10000,"linear",function(){
                  $(this).addClass("flip");
                  goRight(element)
              });
            }
            function goRight(element){
              $(element).animate({"margin-left":0},10000,"linear",function(){
                  $(this).removeClass("flip");
                  goLeft(element)
              });
            }
            goRight(element)
        }                  
    }
});*/