angular.module('polling.loading', [])

.service('Loading', function($ionicLoading)
{

  var self = this;
  var counter = 0;

  this.show = function() 
  {
      if (counter == 0) 
      {
          $ionicLoading.show(
          {
              template: 'Loading...'
          });
      }
      counter++;
  }

  this.hide = function() 
  {
      counter--;
      if (counter == 0) 
      {
          $ionicLoading.hide();
      }
  }

  this.progress = function(promise) 
  {
      self.show();
      return promise.then(function()
      {
          self.hide();
          return promise;
      })
      .catch(function()
      {
          self.hide();
          return promise;
      });
  }

})
