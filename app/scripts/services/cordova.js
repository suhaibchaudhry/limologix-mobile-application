'use strict';

/**
 * @ngdoc service
 * @name LimoCordova.cordova
 * @description
 * # cordova
 * Factory in the LimoCordova.
 */
angular.module('LimoCordova')
    .factory('cordova', function($q,$window) {
        var d = $q.defer(),  
        resolved = false;

        var self = this;
        this.ready = d.promise;

        document.addEventListener('deviceready', function() {
            alert('device ready')
              
            resolved = true;
            d.resolve($window.cordova);
        });

        // Check to make sure we didn't miss the
        // event (just in case)
        setTimeout(function() {
            if (!resolved) {
                if ($window.cordova) d.resolve($window.cordova);
            }
        }, 3000);

        // Public API here
        return this;
    });
