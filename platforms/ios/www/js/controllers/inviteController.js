angular.module('polling.inviteController', [])

.controller('InviteCtrl', function($scope, $q, $cordovaContacts, Loading, Groups, Users, $cordovaSocialSharing, $timeout) 
{
    $scope.searchContactText = '';

    angular.element(document).ready(function () {
        $scope.setPhoneContactsInfo();
    });

    $scope.shareThroughWhatsapp = function() 
    {
        var link = "http://";
        $cordovaSocialSharing
        .shareViaWhatsApp('Please install this app to accept my invite!', null, link)
        .then(function(result) 
        {
            alert("sharing success!");
        }, function(err) 
        {
            alert("sharing failed!");
        });
    };

    $scope.inviteLineClick = function(contact) 
    {
        if (contact.isUser == true) 
        {
            if (contact.isUserOfCurrentGroup == false) 
            {
                contact.isUserOfCurrentGroup = true;
                contact.phoneNumbers.forEach(function(phoneNumber) 
                {
                    Users.getUserByPhoneNumber($scope.filterPhoneNumber(phoneNumber.value)).then(function(user)
                    {
                        if (user != undefined) 
                        {
                            $scope.usersToInvite.push(user);
                        }
                    })
                    .catch(function(error)
                    {
                        alert('Get User By PhoneNumber Failed');
                    }); 
                });
            }
            else if (contact.isUserOfCurrentGroup == true) 
            {
                contact.isUserOfCurrentGroup = false;
                contact.phoneNumbers.forEach(function(phoneNumber) 
                {
                    Users.getUserByPhoneNumber($scope.filterPhoneNumber(phoneNumber.value)).then(function(user)
                    {
                        if (user != undefined) 
                        {
                            for(i = 0; i < $scope.usersToInvite.length; i++) 
                            {
                                if (user.phone == $scope.usersToInvite[i].phone) 
                                {
                                    $scope.usersToInvite.splice(i, 1);
                                }
                            }
                        }
                    })
                    .catch(function(error)
                    {
                        alert('Get User By PhoneNumber Failed');
                    }); 
                });
            }
        }
    };

    $scope.searchTextChanged = function(searchContactText) 
    {
        $scope.searchContactText = searchContactText;
        $scope.searchedPhoneContacts = [];
        for (i = 0; i < $scope.phoneContacts.length; i++) 
        {
            if ($scope.phoneContacts[i].name.formatted.search(searchContactText) != -1) 
            {
                $scope.searchedPhoneContacts.push($scope.phoneContacts[i]);
            }
        }
    }
});