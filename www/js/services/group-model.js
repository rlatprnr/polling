angular.module('polling.group-model', [])

.service('Groups', function($q, Loading) 
{
    var groupsRef = firebase.database().ref('/groups');

    this.setGroup = function(info) 
    {
        var groupRef;
        if (info.id) 
        {
            groupRef = groupsRef.child(info.id);
        } 
        else 
        {
            groupRef = groupsRef.push();
        }

        var group = 
        {
            creator_id: info.creator_id,
            group_name: info.group_name,
            userID_array: info.userID_array,
        };

        var promise = groupRef.set(group).then(function() 
        {
            group.id = groupRef.key;
            return $q.when(group);
        });
        return Loading.progress(promise);
    }

    this.removeGroup = function(id) 
    {
        var promise = groupsRef.child(id)
        .ref.remove().then(function(snapshot)
        {
        });
        return Loading.progress(promise);
    }

    this.getGroupById = function(id) 
    {
        var promise = groupsRef.child(id)
        .once('value').then(function(snapshot) 
        {
            var group = _getGroupInfo(snapshot);
            return $q.when(group);
        });
        return Loading.progress(promise); 
    }

    this.getAll = function()
    {
        var promise = groupsRef.orderByValue()
        .ref.orderByChild('id')
        .once('value').then(function(snapshot) 
        {
            var groupus = [];
            snapshot.forEach(function(data) 
            {
                groupus.push(_getGroupInfo(data));
            });
            return $q.when(groupus);
        });
        return Loading.progress(promise); 
    }

    this.getGroupByCreatorID = function(id) 
    {
        var promise = groupsRef.orderByValue().ref
        .orderByChild('creator_id').equalTo(id)
        .once('value').then(function(snapshot) 
        {
            var groups = [];
            snapshot.forEach(function(data) 
            {
                group = _getGroupInfo(data);
                groups.push(group);
            });
            return $q.when(groups);
        });
        return Loading.progress(promise); 
    }

    function _getGroupInfo(snapshot) 
    {
        var key = snapshot.key;
        var group = snapshot.val();
        group.id = key;
        return group;
    }
})

