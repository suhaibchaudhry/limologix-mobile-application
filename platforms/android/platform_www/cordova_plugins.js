cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.nativesettingsopener/www/settings.js",
        "id": "com.phonegap.plugins.nativesettingsopener.Settings",
        "clobbers": [
            "cordova.plugins.settings"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "id": "cordova-plugin-dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-background-fetch/www/BackgroundFetch.js",
        "id": "cordova-plugin-background-fetch.BackgroundFetch",
        "clobbers": [
            "window.BackgroundFetch"
        ]
    },
    {
        "file": "plugins/com.transistorsoft.cordova.background-geolocation/www/BackgroundGeolocation.js",
        "id": "com.transistorsoft.cordova.background-geolocation.BackgroundGeolocation",
        "clobbers": [
            "window.BackgroundGeolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-fcm/www/FCMPlugin.js",
        "id": "cordova-plugin-fcm.FCMPlugin",
        "clobbers": [
            "FCMPlugin"
        ]
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
        "file": "plugins/cordova-plugin-request-location-accuracy/www/android/RequestLocationAccuracy.js",
        "id": "cordova-plugin-request-location-accuracy.RequestLocationAccuracy",
        "clobbers": [
            "cordova.plugins.locationAccuracy"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
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
    "cordova-plugin-cocoalumberjack": "0.0.1",
    "cordova-plugin-fcm": "1.1.5",
    "cordova-plugin-network-information": "1.3.0",
    "cordova-plugin-request-location-accuracy": "2.2.0",
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-plugin-device": "1.1.3"
};
// BOTTOM OF METADATA
});