angular.module('polling.controllers', [])

.controller('AppCtrl', function($scope, $q, Auth, $ionicModal, $timeout, $state, $cordovaCamera, $cordovaSocialSharing, $window, Polls, Poll, ImageFile, $cordovaContacts, $ionicHistory, Groups, Users, Loading, PhoneContactsFactory, $ionicPlatform) {
  
  $scope.imageWithName = [];
  $scope.rightImageWithName = [];
  $scope.usersToInvite = [];
  $scope.currentGroup;
  $scope.currentGroups = [];
  $scope.usersPhoneNumbers = [];

  angular.element(document).ready(function () {
      $scope.getMyPolls();
      $scope.getToRate();     
      $scope.setCurrentGroups();
      $scope.getUsersPhoneNumbers();
  });

  $scope.getUsersPhoneNumbers = function() {
      Users.getAll().then(function(users){
          users.forEach(function(user){
              $scope.usersPhoneNumbers.push(user.phone);
          });
      })
      .catch(function(error)
      { 
          alert("Get Users Failed");
      });
  }

  $scope.getMyPolls = function() 
  {
      Polls.getAll(Auth.getID()).then(function(polls)
      {
          polls.forEach(function(poll) 
          {
              var item = poll;
              if (poll.status == 'active') 
              {
                  if ((new Date()).getTime() - poll.created_time > poll.expire_time * 60000) 
                  {
                    $scope.setStatusOfThisPoll(poll);
                  }
              }
              $scope.imageWithName.push(item);
              ImageFile.download(poll.photo).then(function(url)
              {
                  item.url = url;
              })
              .catch(function(error)
              { 
                  alert("Image Download Failed");
              });
          });
      })
      .catch(function(error)
      {
          alert('Get Polls Failed');
      });
  };

  $scope.getToRate = function() 
  {
      $scope.getAllWithInvitedID(Auth.getID()).then(function(polls)
      {
          polls.forEach(function(poll) 
          {
              if (poll.status == 'active') 
              {
                  var tempTime = (new Date()).getTime();
                  if (tempTime - poll.created_time > poll.expire_time * 60000) 
                  {
                      $scope.setStatusOfThisPoll(poll);
                  }
              }
              item = poll;
              if (item.status == 'active') 
              {
                  $scope.rightImageWithName.push(item);
                  ImageFile.download(poll.photo).then(function(url)
                  {
                      item.url = url;
                  })
                  .catch(function(error)
                  {
                      alert("Image Download Failed");
                  });
              }
          });
      });
  };

  $scope.setCurrentGroups = function() 
  {
      Groups.getGroupByCreatorID(Auth.getID()).then(function(groups)
      {
          $scope.currentGroups = groups;
      }).catch(function(error)
      {
          alert('Get Groups Failed');
      });
  };

  $scope.getContacts = function() 
  {
      $scope.findContact = function()
      {
          PhoneContactsFactory.find().then(function(contacts)
          {
              $arr = [];
              for (var i = 0; i < contacts.length; i++)
              {
                $arr.push(contacts[i]);
              }
              $scope.phoneContacts = $arr;
          });
      }; 
      $scope.findContact(); 
  };

  $ionicPlatform.ready(function() 
  {  
      $scope.getContacts();
  });

  $scope.onClickTitle = function() 
  {
      $scope.imageWithName = [];
      $scope.rightImageWithName = [];
      $scope.getMyPolls();
      $scope.getToRate(); 
  };

  $scope.setStatusOfThisPoll = function(poll) 
  {
      var temp_status = 0;
      poll.invitedPeopleIDandRate_array.forEach(function(invitedPeopleIDandRate)
      {
          invitedPeopleIDandRate.rate_array.forEach(function(rate)
          {
              if (rate.realValue == undefined) 
              {
                  poll.status = 'expired';
                  Polls.setPoll(poll);
                  temp_status = 1;
              }
          });
      });
      if (temp_status == 0) 
      {
          poll.status = 'completed';
          Polls.setPoll(poll);
      }
  }

  $scope.getAllWithInvitedID = function(id) 
  {
      var promise = Polls.getAllPolls().then(function(polls)
      {
          var tempPolls = [];
          polls.forEach(function(poll)
          {
              poll.invitedPeopleIDandRate_array.forEach(function(invitedPeopleIDandRate)
              {
                  if(invitedPeopleIDandRate.peopleID == id)
                  {
                      tempPolls.push(poll);
                  }
              });
          });
          return $q.when(tempPolls);
      }).catch(function(error)
      {
          alert("Get Polls Failed");
      });
      return Loading.progress(promise);
  }

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

  $scope.gotoToRate = function(rightItem) 
  {
      ImageFile.download(rightItem.photo).then(function(url)
      {
          $scope.toRatePageImage = url;
          $scope.selectedPollToRate = rightItem;
          $state.go("app.toRate");
      }).catch(function(error)
      {
          alert("image download fail");
      });    
  };

  $scope.gotoMyPoll = function(item) 
  {
      $scope.selectedPoll = item;
      $state.go("app.myPoll"); 
  };  

  $scope.gotoAddPoll = function() 
  {
      $state.go("app.addPoll", {}, {reload: true});
  };

  $scope.gotoAddPollWithOutReload = function() 
  {
      $state.go("app.addPoll");
  };

  $scope.gotoContact = function() 
  {
      $state.go("app.contact", {}, {reload: true});
  };
  
  $scope.changeGroup = function(currentGroupID) 
  {
      $scope.currentGroupID = currentGroupID;
      Groups.getGroupById($scope.currentGroupID).then(function(group)
      {
          var users = [];
          if(group.userID_array == undefined) 
          {
              $scope.usersToInvite = [];
              return;
          }
          group.userID_array.forEach(function(userid)
          {
              Users.getUserById(userid).then(function(user)
              {
                  users.push(user);
              });
          });
          $scope.usersToInvite = users;
      }).catch(function(error)
      {
          alert('Get Group Fail');
      });
  };

  $scope.displayCurrentGroup = function() 
  {
      if ($scope.currentGroupID == undefined || $scope.currentGroupID == '' || $scope.currentGroupID == 'Select') 
      {
          alert('Select Group To Edit');
          return;
      }
      Groups.getGroupById($scope.currentGroupID).then(function(group)
      {
          var users = [];
          if(group.userID_array == undefined) 
          {
              $scope.usersToInvite = [];
              return;
          }
          group.userID_array.forEach(function(userid)
          {
              Users.getUserById(userid).then(function(user)
              {
                  users.push(user);
              });
          });
          $scope.usersToInvite = users;
      }).catch(function(error){
          alert('Get Group Fail');
      });
  }

  $scope.saveGroup = function() 
  {
      if ($scope.currentGroupID == undefined || $scope.currentGroupID == '' || $scope.currentGroupID == 'Select') 
      {
          alert('Select Group To Save');
          return;
      }
      var userids = [];
      $scope.usersToInvite.forEach(function(user)
      {
          userids.push(user.id);
      });
      var groupname;
      Groups.getGroupById($scope.currentGroupID).then(function(group)
      {
          groupname = group.group_name;
          Groups.setGroup({
              id: $scope.currentGroupID,
              creator_id: group.creator_id,
              group_name: groupname,
              userID_array: userids,
          });
      });
  };

  $scope.setFeedbackToPoll = function() 
  {
      $scope.selectedPollToRate.invitedPeopleIDandRate_array.forEach(function(invitedPeopleIDandRate)
      {
          if(invitedPeopleIDandRate.peopleID == Auth.getID()) 
          {
              invitedPeopleIDandRate.rate_array = $scope.selectedPollToRate.rateOption_array;
          }
      });
      Polls.setPoll($scope.selectedPollToRate).then(function(poll)
      {
          alert("Set Feedback Successfully!");
      })
      .catch(function(error)
      {
          alert("Set Feedback Failed!");
      });
  };

  $scope.setPhoneContactsInfo = function()
  {
      $scope.searchedPhoneContacts = [];
      var tempCount = $scope.phoneContacts.length;
      for (i = 0; i < tempCount; i++) 
      {
          $scope.setPhoneContacts($scope.phoneContacts[i]);
      }
      
  }

  $scope.setPhoneContacts = function(contact) 
  {     
      contact.isUser = false;
      contact.isUserOfCurrentGroup = false;
      $scope.searchedPhoneContacts.push(contact);
      var promise = contact.phoneNumbers.forEach(function(phoneNumber) 
      {
          if ($scope.usersPhoneNumbers.indexOf($scope.filterPhoneNumber(phoneNumber.value)) != -1)
          {
              contact.isUser = true;
              $scope.usersToInvite.forEach(function(user)
              {
                  if (user.phone == $scope.filterPhoneNumber(phoneNumber.value))
                  {
                      contact.isUserOfCurrentGroup = true;
                  }
              });
          }
      });
      return $q.when(contact);
      return Loading.progress(promise);
  };

});
