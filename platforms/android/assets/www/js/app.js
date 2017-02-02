// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('polling', [
    'ionic', 
    'ngCordova',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'polling.controllers',
    'polling.splashController', 
    'polling.helpController',
    'polling.contactController',
    'polling.inviteController',
    'polling.settingController',
    'polling.addPollController',
    'polling.toRateController',
    'polling.myPollController',
    'polling.services', 
    'polling.loading', 
    'polling.auth',
    'polling.user-model',
    'polling.group-model',
    'polling.user',
    'polling.phonecontacts'
  ])

.run(function($ionicPlatform) 
{
    $ionicPlatform.ready(function() 
    {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        // Notification Settings
        var notificationOpenedCallback = function(jsonData) {
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    };

    // Notification Settings
    window.plugins.OneSignal.init("b2f7f966-d8cc-11e4-bed1-df8f05be55ba",
                                   {googleProjectNumber: "703322744261"},
                                   notificationOpenedCallback);
    
    // Show an alert box if a notification comes in when the user is in your app.
    window.plugins.OneSignal.enableInAppAlertNotification(true); 
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) 
{
    // firebase setting
    var config = 
    {
        apiKey: "AIzaSyByZ3adz3ios2iyo5YUdEr-GU1V4LXDPlY",
        authDomain: "polling-aed75.firebaseapp.com",
        databaseURL: "https://polling-aed75.firebaseio.com",
        storageBucket: "polling-aed75.appspot.com",
    };
    firebase.initializeApp(config);


    $stateProvider

    .state('splash', {
        url: "/splash",
        views: {
            '': {
                templateUrl: 'templates/splash.html',
                controller: 'SplashCtrl',
            }
        }
    })

    .state('help', {
        url: "/help",
        views: {
            '': {
                templateUrl: 'templates/help.html',
                controller: 'HelpCtrl',
            }
        }
    })

    .state('login', {
        url: '/login',
        abstract: true,
        templateUrl: 'templates/login.html',
        data: {
            redirectIfAuth: true
        }
    })

    .state('login.signin', {
        url: '/signin',
        templateUrl: 'templates/login-signin.html',
        controller: 'LoginCtrl'      
    })

    .state('login.register', {
        url: '/register',
        templateUrl: 'templates/login-signup.html',
        controller: 'RegisterCtrl'
    })

    .state('login.forget', {
        url: '/forget',
        templateUrl: 'templates/login-forget.html',
        controller: 'ForgetCtrl'
    })

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl',
        data: {
            auth: true
        }
    })

    .state('app.contact', {    
        url: "/contact",
        views: {
            'tab-contact': {
                templateUrl: "templates/contact.html",
                controller: 'ContactCtrl'
            }
        } 
    })

    .state('app.invite', {
        url: "/invite",
        views: {
            'tab-contact': {
                templateUrl: "templates/invite.html",
                controller: 'InviteCtrl'
            }
        }  
    })

    .state('app.addPoll', {
        url: "/addPoll",
        params: {
            groupToInvite: null
        },
        views: {
            'tab-addPoll': {
                templateUrl: "templates/addPoll.html",
                controller: 'addPollCtrl'
            }
        }
    })

    .state('app.myPoll', {
        url: "/myPoll",
        views: {
            'tab-addPoll': {
                templateUrl: "templates/myPoll.html",
                controller: 'myPollCtrl'
            }
        }
    })

    .state('app.toRate', {
        url: "/toRate",
        views: {
            'tab-addPoll': {
                templateUrl: "templates/toRate.html",
                controller: 'toRateCtrl'
            }
        }
    })

    .state('app.settings', {
        url: "/settings",
        views: {
            'tab-settings': {
                templateUrl: "templates/settings.html",
                controller: 'SettingsCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/splash');
})

.run(function($rootScope, $state, Auth) 
{

    $rootScope.$on('$stateChangeStart', function(event, next) 
    {
        if (Auth.getID()) 
        {
            if (next.data && next.data.redirectIfAuth) 
            {
                event.preventDefault();
                $state.go('app.contact');
            }
        } 
        else 
        {
            if (next.data && next.data.auth) 
            {
                event.preventDefault();
                $state.go('login.signin');
            }
        }
    });
})

.controller('PollingCtrl', function($scope, $http, Auth, $ionicNavBarDelegate, $ionicViewService, $cordovaDialogs) 
{

    // for Notification
    var NOTIFICATION_API = 
    {
        host:         'https://onesignal.com/api/v1/notifications',
        app_id:       '837eb638-a3e4-4d25-9812-67bdf5f34221',
        api_token:    'Basic MjdiMzU2NmUtOTAxNy00MDQ4LWE2N2ItNzY0NWZhMjlmZThh'
    };

    $scope.sendNotification = function(user_id, n_message)
    {
        var _url = NOTIFICATION_API.host;
        return $http({
            url: _url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US',
                'Authorization': NOTIFICATION_API.api_token
            },
            data: {
                app_id: '6017fb99-0c6e-4fd0-a8d9-e61db7e81aa2',
                contents: { 'en': n_message},
                tags: [
                    {"key": "uid", "relation": "=", "value": user_id}
                ]
            },       
        })
        .success(function(data) 
        { 
        })
        .error(function(error) 
        { 
        });
    };

    $scope.viewTitleLogoComponent = "<img src='./img/logoTitle.png' style='vertical-align:middle; width:100px;' ng-click='getMyPolls(); getToRate();'>";

    $scope.lang = {};
    $scope.ui = {};
    $scope.currentLanguage = 'en';
    
    // get language
    $http.get('./lang.json',{})
    .then(function(result)
    {
        $scope.lang = result.data;
        $scope.ui = $scope.lang['en'];
    });

    // logout
    $scope.logout = function() 
    {
        Auth.signOut(); 
    };

    $scope.changeLanguage = function(currentLanguage) 
    { 
        $scope.ui = $scope.lang[currentLanguage];
        $scope.currentLanguage = currentLanguage;
    };

    // for generic usage(PhoneNumber Standardization)
    $scope.filterPhoneNumber = function(phoneNumber) 
    {
        return phoneNumber.replace(/[()\- ]/g, '');
    }

    // check User is in the list
    $scope.containsUser = function(list, obj) 
    {
        for (i = 0; i < list.length; i++) 
        {
            if (list[i].username == obj.username && list[i].password == obj.password && list[i].phone == obj.phone) 
            {
                return true;
            }
        }
        return false;
    };

});
