angular.module('polling.contactController', [])

.controller('ContactCtrl', function($scope, $state ,$stateParams, $ionicScrollDelegate, Groups, Users, Auth, $window, $timeout) 
{
    $scope.usersToParticipants = [];

    $scope.gotoInvite =function() 
    {
        if ($scope.currentGroupID == undefined || $scope.currentGroupID == '' || $scope.currentGroupID == 'Select') 
        {
            alert('Select Group To Save');
        }
        else 
        {
            $state.go("app.invite", {}, {reload: true});
        }
    };
    
    $scope.createNewGroup = function(newGroupName) 
    {
      	if (newGroupName == '' || newGroupName == undefined) 
        {
      		  alert("Input New Group Name");
      	}
        else 
        {
          	$scope.newGroupName = newGroupName;
          	Groups.setGroup(
            {
                creator_id: Auth.getID(),
            		group_name: $scope.newGroupName,
            		userID_array: [],
          	})
            .then(function(group)
            {
          		  $scope.setCurrentGroups();
          	})
            .catch(function(error){
                alert("Group Created Failed");
            });
        }
    };

    $scope.removeGroup = function(currentGroupID) 
    {
      	if (currentGroupID == undefined || currentGroupID == '' || currentGroupID == 'Select') 
        {
      		  alert("Select Group To Remove");
      	}
        else 
        {
          	Groups.removeGroup(currentGroupID).then(function()
            {
            		$scope.setCurrentGroups();
                var temp = $scope.currentGroupID;
                $scope.currentGroupID = "Select";
                $window.location.reload();
          	})
            .catch(function(error){
          		  alert('Group Removed Failed');
          	});
        }
    };

    $scope.gotoAddPollFromContact = function() 
    {
      	if ($scope.currentGroupID == undefined || $scope.currentGroupID == '') 
        {
      		  alert('Select Group To Invite');
      	}
        else
        {
      	    $state.go('app.addPoll');
        }
    };
});