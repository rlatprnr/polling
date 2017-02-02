
angular.module('polling.user-model', [])

.service('Users', function($q, Loading) 
{
    var usersRef = firebase.database().ref('/users');

    var filterPhoneNumber = function(phoneNumber) 
    {
        return phoneNumber.replace(/[()\- ]/g, '');
    }

    this.getAll = function()
    {
        var promise = usersRef.orderByValue()
        .ref.orderByChild('id')
        .once('value').then(function(snapshot) 
        {
            var userus = [];
            snapshot.forEach(function(data) 
            {
                userus.push(_getUserInfo(data));
            });
            return $q.when(userus);
        });
        return Loading.progress(promise); 
    }

    this.setUser = function(info) 
    {
        var userRef;
        if (info.id) 
        {
            userRef = usersRef.child(info.id);
        } 
        else 
        {
            userRef = usersRef.push();
        }

        var user = {
            username: info.username.trim(),
            phone: filterPhoneNumber(info.phone.toString()),
            password: info.password,
        };

        var promise = userRef.set(user).then(function() 
        {
            user.id = userRef.key;
            return $q.when(user);
        });

        return Loading.progress(promise);
    }

    this.getUserById = function(id) 
    {
      var promise = usersRef.child(id)
      .once('value').then(function(snapshot) 
      {
          var user = _getUserInfo(snapshot);
          return $q.when(user);
      });

      return Loading.progress(promise); 
    }

    this.getUserByName = function(username) 
    {
        var promise = usersRef.orderByValue().ref
        .orderByChild('username').equalTo(username)
        .once('value').then(function(snapshot) 
        {
            var user;
            snapshot.forEach(function(data) 
            {
                user = _getUserInfo(data);
            });
            return $q.when(user);
        });

        return Loading.progress(promise); 
    }

    this.getUserByPhoneNumber = function(phonenumber) 
    {
        var promise = usersRef.orderByValue().ref
        .orderByChild('phone').equalTo(phonenumber)
        .once('value').then(function(snapshot) 
        {
            var user;
            snapshot.forEach(function(data) 
            {
                user = _getUserInfo(data);
            });
            return $q.when(user);
        });

        return Loading.progress(promise); 
    }

    this.getUserByNameAndPass = function(username, password) 
    {
        var promise = usersRef.orderByValue().ref
        .orderByChild('username').equalTo(username)
        .once('value').then(function(snapshot) 
        {
            var user;
            var tempUser;
            snapshot.forEach(function(data) 
            {
                tempUser = _getUserInfo(data);
                if (tempUser.password == password) 
                {
                    user = tempUser;
                }
            });
            return $q.when(user);
        });

        return Loading.progress(promise); 
    }

    function _getUserInfo(snapshot) 
    {
        var key = snapshot.key;
        var user = snapshot.val();
        user.id = key;
        return user;
    }
})

