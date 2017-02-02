angular.module('polling.settingController', [])

.controller('SettingsCtrl', function($scope, $cordovaContacts) 
{
    $scope.on_button_clicked = 'button-clicked';
    $scope.eng_button_clicked = 'button-clicked'; 
    $scope.chn_button_clicked = '';

    $scope.onButtonClicked = function() 
    {
        $scope.on_button_clicked = 'button-clicked';
        $scope.off_button_clicked = '';
    }
    
    $scope.offButtonClicked = function() 
    {
        $scope.on_button_clicked = '';
        $scope.off_button_clicked = 'button-clicked';
    }
});