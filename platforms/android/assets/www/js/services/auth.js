
angular.module('polling.auth', [])

.service('Auth', function($q, $injector, $window, Users, Loading) 
{

    var _self = this;
    var _currentUser = null;
    
    function sendTag(identifier, value)
    {
        var nValue = value == true ? 1 : 0;

        if (window.plugins != null) 
            window.plugins.OneSignal.sendTag(identifier, value);
    }

    this.signUp = function(info) 
    {
        var promise = Users.getUserByName(info.username).then(function(user) 
        {
            if (user) 
            {
                return $q.reject('Someone already has this username.');
            }
            return Users.setUser(info).then(function(user) 
            {
                _setUser(user);
                sendTag('uid', user.id);
                return $q.when(user);
            });
        });

        return Loading.progress(promise);
    }


    this.signIn = function(username, password) 
    {

      var promise = Users.getUserByNameAndPass(username, password).then(function(user) 
      {
          if (!user) 
          {
              return $q.reject('That username or password is incorrect.');
          }
          _setUser(user);
          return $q.when(user);
      });

      return Loading.progress(promise);
    }


    this.signOut = function() 
    {
        _setUser();
        $injector.get('$state').go('login.signin');
    }

    // ------------ user information --------------

    function _setUser(user) 
    {
        _currentUser = user;
        if (user) 
        {
            $window.localStorage.setItem('user-id', user.id);
        } else 
        {
            $window.localStorage.removeItem('user-id');
        }
    }


    this.getID = function() 
    {
        return window.localStorage.getItem('user-id');
    }


    this.getUser = function() 
    {
        var id = _self.getID();
        var promise;
        if (!id) 
        {
          promise = $q.reject('');
        } 
        else if (_currentUser) 
        {
          promise = $q.when(_currentUser);
        } 
        else 
        {
          promise = Users.getUserById(id);
        }
        
        return Loading.progress(promise);
    }


    this.updateUser = function(info) 
    {
        info.id = _self.getID();
        var promise = Users.setUser(info).then(function(user) 
        {
            _setUser(user);
            return $q.when(user);
        });

        return Loading.progress(promise);
    }

})
