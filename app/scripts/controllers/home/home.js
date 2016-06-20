'use strict';

/**
 * @ngdoc function
 * @name limoLogixApp.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the limoLogixApp
 */
app
    .controller('homeCtrl', ['$scope', '$state', '$http', 'appSettings', 'notify', '$window', 'services', 'AppConstants', '$timeout',
        function($scope, $state, $http, appSettings, notify, $window, services, constants, $timeout) {
            $('a[data-confirm]').click(function(ev) {
                var href = $(this).attr('href');
                if (!$('#dataConfirmModal').length) {
                    $('body').append('<div id="dataConfirmModal" class="modal" role="dialog" aria-labelledby="dataConfirmLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="dataConfirmLabel">Please Confirm</h3></div><div class="modal-body"></div><div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button><a class="btn btn-primary" id="dataConfirmOK">OK</a></div></div>');
                }
                $('#dataConfirmModal').find('.modal-body').text($(this).attr('data-confirm'));
                $('#dataConfirmOK').attr('href', href);
                $('#dataConfirmModal').modal({ show: true });
                return false;
            });
            //                     var source, destination;
            //                     var directionsDisplay;
            //                     var directionsService = new google.maps.DirectionsService();
            //                     directionsDisplay = new google.maps.DirectionsRenderer({
            //                         suppressMarkers: true,
            //                         polylineOptions: {
            //                             strokeColor: "#9ACD32",
            //                             strokeWeight: 5
            //                         }
            //                     });
            //                     var icons = {
            //                         start: new google.maps.MarkerImage(
            //                             'images/source_marker.png',
            //                             new google.maps.Size(44, 32), //width,height
            //                             new google.maps.Point(0, 0), // The origin point (x,y)
            //                             new google.maps.Point(22, 32)),
            //                         end: new google.maps.MarkerImage(
            //                             'images/destination_marker.png',
            //                             new google.maps.Size(44, 32),
            //                             new google.maps.Point(0, 0),
            //                             new google.maps.Point(22, 32))
            //                     };

            //                     var map = new google.maps.Map(document.getElementById('dvMap'));
            //                     directionsDisplay.setMap(map);

            //                     //*********DIRECTIONS AND ROUTE**********************//
            //                     source ='Marathahalli, Bengaluru, Karnataka 560037, India'; 
            //                     destination = 'Hebbal, Bengaluru, Karnataka 560024, India';

            //                     var request = {
            //                         origin: source,
            //                         destination: destination,
            //                         travelMode: google.maps.TravelMode.DRIVING
            //                     };
            //                     directionsService.route(request, function(response, status) {
            //                         if (status == google.maps.DirectionsStatus.OK) {
            //                             directionsDisplay.setDirections(response);
            //                             var leg = response.routes[0].legs[0];
            //                             makeMarker(leg.start_location, icons.start, source, map);
            //                             makeMarker(leg.end_location, icons.end, destination, map);
            //                         } else {
            //                             notify({ classes: 'alert-error', message: 'unable to retrive route' });
            //                         }
            //                     });

            //                     function makeMarker(position, icon, title, map) {
            //                         new google.maps.Marker({
            //                             position: position,
            //                             map: map,
            //                             icon: icon,
            //                             title: title
            //                         });
            //                     }


            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(p) {
                    var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                    var mapOptions = {
                        center: LatLng,
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
                    var marker = new google.maps.Marker({
                        position: LatLng,
                        map: map,
                        title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
                    });
                    google.maps.event.addListener(marker, "click", function(e) {
                        var infoWindow = new google.maps.InfoWindow();
                        infoWindow.setContent(marker.title);
                        infoWindow.open(map, marker);
                    });
                });
            } else {
                alert('Geo Location feature is not supported in this browser.');
            }




        }
    ])
