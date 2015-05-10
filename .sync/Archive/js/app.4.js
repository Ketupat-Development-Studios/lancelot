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

var freelance = angular.module('freelance', ['ngRoute','ngMaterial'], 
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

        .when('/hire', {
        	templateUrl : 'pages/hire.html',
        	controller  : 'hireCtrl',
        	title       : 'Hire Someone'
        })

        .when('/offer', {
        	templateUrl : 'pages/offer.html',
        	controller  : 'offerCtrl',
        	title       : 'Offer Your Services'
        })

        .otherwise({
            redirectTo: '/'
        });;
});

freelance.controller("viewCtrl", ["$scope","$http","$location", function($scope,$http,$location,$rootScope){
  //view after selecting category
  $scope.curCatId = localStorage.getItem("curCatId")
  $scope.curCatName = localStorage.getItem("curCatName").toUpperCase()
  $http.post(apiURL,{
    'query': 'getlancersbycat',
    'id'   : $scope.curCatId
  }, config).success(function(response){
    console.log(response)
    $scope.allJobs = response
    //all stuff must be done only after response is received
  })
	$scope.getNumber = function(num) {return new Array(num);}
  $scope.goHome = function (){$location.path("/home")}
}]);

freelance.controller("loginCtrl", ["$scope","$http","$location",function($scope,$http,$location){
	$location.path("/home");
}])

freelance.controller("offerCtrl", ["$scope","$http","$location", function($scope,$http,$location){
	$scope.offer = {"category":"","name":"","description":"","dp":""}
}])

freelance.controller("catCtrl", ["$scope","$http","$location", function($scope, $http, $location, $rootScope){
  $http.post(apiURL,{
    'query'      :'getcats'
  }, config).success(function(response){
    console.log(response)
    $scope.allCats = response
    //all stuff must be done only after response is received
  })
  $scope.goToCat = function (cat_id, cat_name) {
    localStorage.setItem("curCatId",cat_id)
    localStorage.setItem("curCatName",cat_name)
    $location.path("/view")
  }
}])

freelance.controller('LeftCtrl', ["$scope","$timeout","$mdSidenav","$mdUtil","$log","$location","$http", function ($scope, $timeout, $mdSidenav, $mdUtil, $log, $location, $http) {
  $scope.close = function () {
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });
  };
}])


freelance.controller('topBarCtrl', ["$scope","$timeout","$mdSidenav","$mdUtil","$log","$location","$http","$rootScope", function($scope, $timeout, $mdSidenav, $mdUtil, $log, $location, $http, $rootScope){
  $scope.toggleLeft = buildToggler('left');
  $rootScope.navBarIsThere = null
  $rootScope.chats = [
    {
      "id"      : "123",
      "name"    : "Mario Luigi",
      "service" : "Expert Plumber",
      "dp"      : "what"
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
}])

freelance.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background'    : 'url(' + url +')',
            'background-size'     : 'contain',
            'background-position' : 'center center'
        });
    };
})