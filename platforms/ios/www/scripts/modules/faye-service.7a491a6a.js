'use strict';

app.service('FayeService', ['$http', '$q','$rootScope',funcservices]);

function funcservices($http, $q,$rootScope) {
    //Get routes and display route direction in google map
                this.map;
                this.marker;
               this.getRoutes = function(currLoc,pickup, dropoff, notify,isInfoWindowVisible,check_infoWindow,map_ele_id) {
                    var self = this;
                    var source, destination;
                    var directionsDisplay;
                    var directionsService = new google.maps.DirectionsService();
                    directionsDisplay = new google.maps.DirectionsRenderer({
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: "#9ACD32",
                            strokeWeight: 5
                        }
                    });
                    var icons = {
                        start: new google.maps.MarkerImage(
                            'images/source_marker.9db0b1d4.png',
                            new google.maps.Size(44, 32), //width,height
                            new google.maps.Point(0, 0), // The origin point (x,y)
                            new google.maps.Point(22, 32)),
                        end: new google.maps.MarkerImage(
                            'images/destination_marker.23597b9e.png',
                            new google.maps.Size(44, 32),
                            new google.maps.Point(0, 0),
                            new google.maps.Point(22, 32))
                    };
                    navigator.geolocation.getCurrentPosition(function(p) {
                        var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
                        var mapOptions = {
                            center: LatLng,
                            zoom: 13,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        //var map = new google.maps.Map(document.getElementById('dvMap'));

                       self.map = new google.maps.Map(document.getElementById(map_ele_id), mapOptions);
                       self.marker = new google.maps.Marker({
                            position: LatLng,
                            map: self.map,
                            icon: 'images/driver/location_ping.0b6a1b43.png',
                            title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
                        });
                        directionsDisplay.setMap(self.map);

                        source = pickup;
                        destination = dropoff;

                        var request = {
                            origin: source,
                            destination: destination,
                            travelMode: google.maps.TravelMode.DRIVING
                        };
                        directionsService.route(request, function(response, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                                var leg = response.routes[0].legs[0];
                                if(!isInfoWindowVisible){
                                    makeMarker(leg.start_location, icons.start, source, self.map);
                                    makeMarker(leg.end_location, icons.end, destination, self.map);
                                }else{
                                    makeMarker_source(leg.start_location, icons.start, source, self.map,check_infoWindow);
                                    makeMarker_destination(leg.end_location, icons.end, destination, self.map,check_infoWindow);
                                }
                                
                            } else {
                                // notify({ classes: 'alert-error', message: 'unable to retrive route' });
                            }
                        });
                    });

                    //*********DIRECTIONS AND ROUTE**********************//


                    function makeMarker_source(position, icon, title, map,check_infoWindow) {
                      
                        var pickup_point= pickup;
                        var marker_pickup = new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: icon,
                            //title: (check_infoWindow == "pickuppoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><a href = 'http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + pickup_point + "'class = 'pickUpText'>" + pickup_point + "</p></div>" : title
                            title: (check_infoWindow == "pickuppoint") ? "<div>"+
                            "<img border='0' id='infoWindowid' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img>"+
                            "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + pickup_point + "'class = ''><img src='images/driver/nav-icon.1a509916.png' class = 'nav-icon1'/></a>"+
                            "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + pickup_point + "'class = 'pickUpText'>" + pickup_point + "</p></div>" : title
                            //title: (check_infoWindow == "pickuppoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><a href ='http://maps.google.com/maps?saddr="+pickup+"&amp;daddr="+dropoff+"&amp;ll="+"kalyannagar"+"' class = 'pickUpText'>" + pickup + "</p></div>" : title
                            //title: (check_infoWindow == "pickuppoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><p class = 'pickUpText'>" + pickup + "</p></div>" : title
                        });
                        if(check_infoWindow == "pickuppoint"){
                            var infoWindow = new google.maps.InfoWindow();
                             infoWindow.setContent(marker_pickup.title);
                             infoWindow.open(map, marker_pickup);
                             google.maps.event.addListener(marker_pickup, "click", function(e) {
                                  infoWindow.setContent(marker_pickup.title);
                                  infoWindow.open(map, marker_pickup);
                             });
                        }
                        
                    }
                    function makeMarker_destination(position, icon, title, map,check_infoWindow) {
                        var marker_dropoff = new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: icon,
                            //title: (check_infoWindow == "dropoffpoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + dropoff + "'class = 'pickUpText'>" + dropoff + "</p></div>" : title
                             title: (check_infoWindow == "dropoffpoint") ? "<div>"+
                            "<img border='0' id='infoWindowid' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img>"+
                            "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + dropoff + "'class = ''><img src='images/driver/nav-icon.1a509916.png' class = 'nav-icon2'/></a>"+
                            "<a href ='http://maps.google.com/maps?saddr=" + currLoc + "&amp;daddr=" + dropoff + "'class = 'pickUpText'>" + dropoff + "</p></div>" : title
                            //title: (check_infoWindow == "dropoffpoint") ? "<div><img border='0' align='Left' width='100%' src='images/driver/popup1.ab07a1b7.jpg'></img><p class = 'pickUpText'>" + dropoff + "</p></div>" : title
                        });
                         if(check_infoWindow == "dropoffpoint"){  
                             var infoWindow = new google.maps.InfoWindow();
                             infoWindow.setContent(marker_dropoff.title);
                             infoWindow.open(map, marker_dropoff);
                             google.maps.event.addListener(marker_dropoff, "click", function(e) {
                                  infoWindow.setContent(marker_dropoff.title);
                                  infoWindow.open(map, marker_dropoff);
                             });
                         }
                        
                    }
                    function makeMarker(position, icon, title, map) {
                        new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: icon,
                            title: title
                        });
                    }
                }

                this.watchPositions = function(){
                    
                }
            
        

}
