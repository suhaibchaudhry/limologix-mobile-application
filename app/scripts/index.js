'use strict';

/**
 * @ngdoc overview
 * @name LimoCordova  
 * @description
 * # LimoCordova
 *
 * Main module of the application.
 */

/*jshint -W079 */

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, true);
    },

    onDeviceReady: function() {

         //      var client = new Faye.Client('http://172.16.90.117:9292/faye'); 
         // alert(client)
        //Keep in mind the function will return null if the token has not been established yet. 
            FCMPlugin.getToken(
              function(token){
                alert(token);
              },
              function(err){
                alert('error retrieving token: ' + err);
              }
            )
            FCMPlugin.onNotification(   
                function(data){
                    alert('dsd')
                     if(data.wasTapped){
                     //Notification was received on device tray and tapped by the user.
                        //alert(data);
                         alert(JSON.stringify(data));
                            // var data =  JSON.stringify(data);
                            // var title = data.aps.alert.title;
                            // var body = data.aps.alert.body;
                     }else{
                     //Notification was received in foreground. Maybe the user needs to be notified.
                       // alert(data);
                        //alert(JSON.stringify(data));
                        var note =  JSON.stringify(data);
                        alert(note)

                        if(note){
                             var title = note.aps.alert.title;
                             var body = note.aps.alert.body;
                             alert('title',title)
                        }
                       
                     }
                 },
                 function(msg){
                   alert('onNotification callback successfully registered: ' + msg);
                 },
                 function(err){
                   alert('Error registering onNotification callback: ' + err);
                 }
            );
            FCMPlugin.subscribeToTopic('topicExample');
   
            // FCMPlugin.onNotificationReceived(payload){
            //     alert('heyyy push notify');
            //     alert(payload);
            // }
            angular.element(document).ready(function() {
             alert('device ready')
                var domElem = document.getElementById('deviceready');
                angular.bootstrap(domElem,['LimoCordova']); 

            });
    },
};
app.initialize();