var breakpoint = "";

if ($(window).width() < 768) {
    breakpoint = "xs";
}
else if ($(window).width() >= 768 &&  $(window).width() <= 992) {
    breakpoint = "sm";
}
else {
	// Not really, but for the purpose of this code it will never need to be lg
    breakpoint = "md";
}

var app = angular.module('getPuppiesImages', []);

var ACCESS_TOKEN = '1518439702.1677ed0.d0e5bab887f74ce58233b3a468a551bb'; // basic scope access token required
var FEED_NUMBER = 20;

function selectPuppies(feed) {
	for (var i in feed.tags) {
		if (feed.tags[i] == 'gentlejunglepuppy') {
			return feed
		}
	}
}

app.controller('getImageCtlr', function($scope, $q, $log) {

	var nextUrl, pageNumber
	var storage = [] //store all the feeds received, so no need to ask for the same feeds again when hit prev or next

	function getIns(URL) {
		return $q(function(resolve, reject) {
			$.ajax({
				method: 'GET',
				url: URL,
				dataType: "jsonp",
			}).then(
				function(message) {
					if (message.meta.code != 200) {
						reject( message.meta.error_message )
					} else {
						$log.log(message)
						resolve( message )
					}
				}
			);
		})
	}

	var firstUrl = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + ACCESS_TOKEN + '&count=' + FEED_NUMBER
	var promise = getIns(firstUrl)
	promise.then(
		function(message) {
			var puppies = message.data.filter(selectPuppies);
			var count = 0;
			var new_puppies = [];
			var puppy_row = [];
			for (var puppy in puppies) {
				count++;
				puppy_row.push(puppies[puppy]);
				if (breakpoint == "xs" && count == 1) {
					new_puppies.push(puppy_row);
					puppy_row = [];
					count = 0;
				} else if (breakpoint == "sm" && count == 2) {
					new_puppies.push(puppy_row);
					puppy_row = [];
					count = 0;					
				} else if (breakpoint == "md" && count == 3) {
					new_puppies.push(puppy_row);
					puppy_row = [];
					count = 0;						
				}
			}
			$scope.puppies = new_puppies
			storage.push(new_puppies)
			pageNumber = 0
			nextUrl = message.pagination.next_url
			$('#puppies').removeClass('hidden').addClass('show')
			$('#spinner').removeClass('show').addClass('hidden')
		},
		function(error) {
			$log.error(error)
			$('#spinner').removeClass('show').addClass('hidden')
			$('#errorMessage').removeClass('hidden').addClass('show')
			$scope.errorMessage = "The application has encountered an unknown error. Our technical staff have been automatically notified and will be looking into this with the utmost urgency."
		}
	)

	$scope.next = function() {
		pageNumber ++
		if (pageNumber === 1) {
			$('#prev').removeClass('not-active')
		}
		if (pageNumber < storage.length) {
			$scope.puppies = storage[pageNumber]
		} else {
			var promise = getIns(nextUrl)
			promise.then(
				function(message) {
					var puppies = message.data.filter(selectPuppies);
					var count = 0;
					var new_puppies = [];
					var puppy_row = [];
					for (var puppy in puppies) {
						count++;
						puppy_row.push(puppies[puppy]);
						if (breakpoint == "xs" && count == 1) {
							new_puppies.push(puppy_row);
							puppy_row = []; 
							count = 0;
						} else if (breakpoint == "sm" && count == 2) {
							new_puppies.push(puppy_row);
							puppy_row = []; 
							count = 0;					
						} else if (breakpoint == "md" && count == 3) {
							new_puppies.push(puppy_row);
							puppy_row = []; 
							count = 0;						
						}
					}
					$scope.puppies = new_puppies;
					console.log(new_puppies);
					storage.push(new_puppies);
					nextUrl = message.pagination.next_url
				},
				function(error) {
					$log.error(error)
				}
			)
		}
	}

	$scope.prev = function() {
		pageNumber --;
		$scope.puppies = storage[pageNumber];
		if (pageNumber === 0)
			$('#prev').addClass('not-active')
	}
});
