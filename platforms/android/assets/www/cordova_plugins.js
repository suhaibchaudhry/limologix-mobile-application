cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
        "id": "cordova-plugin-fcm.FCMPlugin",
        "clobbers": [
            "FCMPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova.plugins.diagnostic.api-22/www/android/diagnostic.js",
        "id": "cordova.plugins.diagnostic.api-22.Diagnostic",
        "clobbers": [
            "cordova.plugins.diagnostic"
        ]
    },
    {
        "file": "plugins/cordova-plugin-request-location-accuracy/www/android/RequestLocationAccuracy.js",
        "id": "cordova-plugin-request-location-accuracy.RequestLocationAccuracy",
        "clobbers": [
            "cordova.plugins.locationAccuracy"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.nativesettingsopener/www/settings.js",
        "id": "com.phonegap.plugins.nativesettingsopener.Settings",
        "clobbers": [
            "cordova.plugins.settings"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-fcm": "1.1.1",
    "cordova-plugin-geolocation": "2.2.0",
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-network-information": "1.3.0",
    "cordova.plugins.diagnostic.api-22": "2.3.10-api-22",
    "cordova-plugin-request-location-accuracy": "2.2.0",
    "com.phonegap.plugins.nativesettingsopener": "1.2"
};
// BOTTOM OF METADATA
});