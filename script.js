var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
	$scope.hasToken = true;
	var token = window.location.hash;
	console.log(token);
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];

  $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;
	  $http({
	    method: "JSONP",
	    url: mediaUrl,
	    params: {
	    	callback: "JSON_CALLBACK",
        	access_token: "210853703.8ae6b7d.c0e8db0a13d54fe9a419bf89608c30df"
        // you need to add your access token here, as per the documentation
	    }
	  }).then(function(response) {
      $scope.picArray = response.data.data;
      console.log(response);
      $scope.egoScore = 0;
      $scope.popularity = 0;
      $scope.activeDay = 0;
      $scope.brevity = 0;
      $scope.visibility = 0;
      $scope.monday = 0;
      $scope.tuesday = 0;
      $scope.wednesday = 0;
      $scope.thursday = 0;
      $scope.friday = 0;
      $scope.saturday = 0;
      $scope.sunday = 0;
      for (var i =0; i< $scope.picArray.length; i++) {
      	var pic = $scope.picArray[i];
      	var timestamp = $scope.picArray[i].created_time;
           var a = new Date(timestamp*1000);
           var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
           var dayOfWeek = days[a.getDay()]
    	if (dayOfWeek === 'Sunday') {
    		$scope.sunday = $scope.sunday +1;
    	}
    	if (dayOfWeek === 'Monday') {
    		$scope.monday = $scope.monday +1;
    	}
    	if (dayOfWeek === 'Tuesday') {
    		$scope.tuesday = $scope.tuesday +1;
    	}
    	if (dayOfWeek === 'Wednesday') {
    		$scope.wednesday = $scope.wednesday +1;
    	}
    	if (dayOfWeek === 'Thursday') {
    		$scope.thursday = $scope.thursday +1;
    	}
    	if (dayOfWeek === 'Friday') {
    		$scope.friday = $scope.friday +1;
    	}
    	if (dayOfWeek === 'Saturday') {
    		$scope.saturday = $scope.saturday +1;
    	}

        var weekArray = [$scope.sunday, $scope.monday, $scope.tuesday, $scope.wednesday, $scope.thursday, $scope.friday, $scope.saturday]
        $scope.maxDay = 0;
        	for(var j=0; j<weekArray.length; j++) {
        		if (weekArray[j] > $scope.maxDay) {
        			$scope.maxDay = days[j];
        		}
        	}   
    	if (pic.user_has_liked === true) {
    		$scope.egoScore = $scope.egoScore + 1;
    	}
    	if (pic.likes.count >= 0) {
    		$scope.popularity = $scope.popularity + pic.likes.count/$scope.picArray.length;
    	}
    	//console.log(pic.tags.length);
    	if (pic.tags.length >= 0) {
    		$scope.visibility = $scope.visibility + pic.tags.length/$scope.picArray.length;
    	}
    	//console.log(pic.caption.text.length)
    	if (pic.caption.text.length >= 0) {
    		$scope.brevity = $scope.brevity + pic.caption.text.length/$scope.picArray.length;
    	}
      }
      for (var i = 0; i < $scope.picArray.length; i++) {
      	analyzeSentiments(i);
      }
      // now analyze the sentiments and do some other analysis
      // on your images 
	  })
	};

	var analyzeSentiments = function(imgIdx) {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
    	$http({
    		method: "GET",
    		url: "https://twinword-sentiment-analysis.p.mashape.com/analyze/",
    		params: {
    			text: $scope.picArray[imgIdx].caption.text,
    		},
    		headers: {
    			"X-Mashape-Key": "Th3XBxonXUmshah63CPixRUk2rDlp1eNuLEjsnYQ1UnNvMtgYa"
    		}
    	}).then(function(response) {
    		$scope.picArray[imgIdx]["score"] = response.data.score;
    	});
	}


});
