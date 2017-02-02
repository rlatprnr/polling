'use strict';

/**
 * @ngdoc function
 * @name docmanWebApp.controller:LoginCtrl, RegisterCtrl
 * @description
 * # LoginCtrl, RegisterCtrl
 * Controller of the docmanWebApp
 */
angular.module('polling.user', [])

  .controller('RegisterCtrl', function ($scope, $state, Auth) 
  {
      $scope.form = {};

      $scope.signUp = function() 
      {
          Auth.signUp($scope.form).then(function()
          {
              $state.go('app.contact');
          })
          .catch(function(error)
          {
              $scope.form.error = error;
          });
      };

  })

  .controller('LoginCtrl', function ($scope, $state, Auth) 
  {
      $scope.form = {};

      $scope.signIn = function() 
      {
          Auth.signIn($scope.form.username, $scope.form.password).then(function()
          {
              $state.go('app.contact');
          })
          .catch(function(error)
          {
              $scope.form.error = error;
          });
      };
  })

  .controller('ForgetCtrl', function ($scope) 
  {
    
  });
