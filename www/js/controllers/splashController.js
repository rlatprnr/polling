angular.module('polling.splashController', [])

.controller('SplashCtrl', function($scope, $state ,$stateParams, $interval) 
{
    $scope.number = 10;
    var stop = $interval(function()
    {
        $scope.number --;
        if ($scope.number < 1) 
        {
            $interval.cancel(stop);
            $state.go("help");
        }
    }, 1000);

    $scope.gotoHelp = function() 
    {
    	    //$state.go("help");
    }
});