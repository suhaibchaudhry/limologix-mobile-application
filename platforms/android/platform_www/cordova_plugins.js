cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.phonegap.plugins.nativesettingsopener.Settings",
        "file": "plugins/com.phonegap.plugins.nativesettingsopener/www/settings.js",
        "pluginId": "com.phonegap.plugins.nativesettingsopener",
        "clobbers": [
            "cordova.plugins.settings"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification",
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification_android",
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-background-fetch.BackgroundFetch",
        "file": "plugins/cordova-plugin-background-fetch/www/BackgroundFetch.js",
        "pluginId": "cordova-plugin-background-fetch",
        "clobbers": [
            "window.BackgroundFetch"
        ]
    },
    {
        "id": "com.transistorsoft.cordova.background-geolocation.BackgroundGeolocation",
        "file": "plugins/com.transistorsoft.cordova.background-geolocation/www/BackgroundGeolocation.js",
        "pluginId": "com.transistorsoft.cordova.background-geolocation",
        "clobbers": [
            "window.BackgroundGeolocation"
        ]
    },
    {
        "id": "cordova-plugin-fcm.FCMPlugin",
        "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
        "pluginId": "cordova-plugin-fcm",
        "clobbers": [
            "FCMPlugin"
        ]
    },
    {
        "id": "cordova-plugin-network-information.network",
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "id": "cordova-plugin-network-information.Connection",
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "id": "cordova-plugin-request-location-accuracy.RequestLocationAccuracy",
        "file": "plugins/cordova-plugin-request-location-accuracy/www/android/RequestLocationAccuracy.js",
        "pluginId": "cordova-plugin-request-location-accuracy",
        "clobbers": [
            "cordova.plugins.locationAccuracy"
        ]
    },
    {
        "id": "cordova.plugins.diagnostic.api-22.Diagnostic",
        "file": "plugins/cordova.plugins.diagnostic.api-22/www/android/diagnostic.js",
        "pluginId": "cordova.plugins.diagnostic.api-22",
        "clobbers": [
            "cordova.plugins.diagnostic"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.nativesettingsopener": "1.2",
    "cordova-plugin-dialogs": "1.3.0",
    "cordova-plugin-background-fetch": "4.0.0",
    "com.transistorsoft.cordova.background-geolocation": "2.1.6",
    "cordova-plugin-app-name": "1.0.0",
    "cordova-plugin-fcm": "1.1.5",
    "cordova-plugin-network-information": "1.3.0",
    "cordova-plugin-request-location-accuracy": "2.2.0",
    "cordova-plugin-whitelist": "1.3.0",
    "cordova.plugins.diagnostic.api-22": "2.3.10-api-22"
};
// BOTTOM OF METADATA
});