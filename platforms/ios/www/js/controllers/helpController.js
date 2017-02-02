angular.module('polling.helpController', [])

.controller('HelpCtrl', function($scope, $state) 
{
	$scope.gotoContact = function() 
	{
		$state.go('app.contact');
	}
});