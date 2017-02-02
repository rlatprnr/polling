'use strict';

angular.module('polling.services', [])

.service('Polls', function($q, Poll, Auth, Loading) 
{

    var pollsRef = firebase.database().ref('/polls');

    /**
     * get all documents
     * @param  uid
     * @return promise
     */
    this.getAll = function(creator_id) 
    {
        var promise = pollsRef.orderByValue().ref
        .orderByChild('creator_id').equalTo(creator_id)
        .once('value').then(function(snapshot) 
        {
            var pollus = [];
            snapshot.forEach(function(data) 
            {
                pollus.push(_getPoll(data));
            });
            return $q.when(pollus);
        });

        return Loading.progress(promise); 
    }

    this.getAllWithID = function(id) 
    {
        var promise = pollsRef.orderByValue().ref
        .orderByKey().equalTo(id)
        .once('value').then(function(snapshot) 
        {
            var pollus = [];
            snapshot.forEach(function(data) 
            {
                pollus.push(_getPoll(data));
            });
            return $q.when(pollus);
        });

        return Loading.progress(promise); 
    }

    this.getAllPolls = function() 
    {
        var promise = pollsRef.orderByValue().ref
        .orderByChild('creator_id')
        .once('value').then(function(snapshot) 
        {
            var pollus = [];
            snapshot.forEach(function(data) 
            {
                pollus.push(_getPoll(data));
            });
            return $q.when(pollus);
        });

        return Loading.progress(promise);
    }

    /**
     * set document
     * @param doc
     */
    this.setPoll = function(poll) 
    {
        var pollRef;
        if (poll.id) 
        {
            pollRef = pollsRef.child(poll.id);
        } 
        else 
        {
            pollRef = pollsRef.push();
        }
        poll.id = pollRef.key;
        var info = poll.getInfo();
        var promise = pollRef.set(info);
        return $q.when(poll);
        return Loading.progress(promise);
    }

    /**
     * get document information
     * @param  data
     */
    function _getPoll(data) 
    {
        var info = data.val();
        info.id = data.key;
        info.date = new Date(info.date);
        return new Poll(info);
    }
})


.service('ImageFile', function($q, Auth, Loading) 
{

    var storageRef = firebase.storage().ref();

    /**
     * document file upload
     * @param  file
     */
    this.upload = function(file, uploadname) 
    {
        var promise;
        if (file) 
        {
            uploadname = uploadname || Auth.getID() + new Date().getTime() + file.name;
            var uploadTask = storageRef.child(uploadname).put(file, {contentType: file.type});
            promise = $q(function(resolve, reject)
            {
                uploadTask.on('state_changed', null, function(error) 
                {
                    reject(error);
                }, function() { 
                    resolve(uploadname);
                });
            })
        } 
        else 
        {
            promise =  $q.reject('error');
        }
          
        return Loading.progress(promise);
    }

    this.download = function(filename) 
    {
        var fileReference = storageRef.child(filename);
        var promise = fileReference.getDownloadURL();
        return Loading.progress(promise);
    }

})


.factory('Poll', function(Auth) 
{

    /**
     * document object
     * @param info
     */
    function Poll (info) 
    {
        this.id = (info && info.id) || null;
        this.creator_id = (info && info.creator_id) || Auth.getID();
        this.photo = info.photo;
        this.rateOption_array = info.rateOption_array;
        this.invitedPeopleIDandRate_array = info.invitedPeopleIDandRate_array;
        this.created_time = info.created_time;
        this.expire_time = info.expire_time;
        this.status = info.status;
    }

    /**
     * get document information
     */
    Poll.prototype.getInfo = function() 
    {
        return {
            creator_id: this.creator_id,
            photo: this.photo,
            rateOption_array: this.rateOption_array,
            invitedPeopleIDandRate_array: this.invitedPeopleIDandRate_array,
            created_time: this.created_time,
            expire_time: this.expire_time,
            status: this.status,
        };
    }

    return Poll;
})