import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {SettingsService} from './settings';
import {VenueService} from './venues';

declare var window: any;



@Injectable()
export class GeoService {
    currentCoords = {
        lat: 40.740837,
        lng: -74.001806
    }

    constructor(private platform:Platform,
                public venueService:VenueService){ }

    initBackgroundLocation(){
        this.platform.ready().then(()=>{
            
                console.log("================>initBackgroundLocation<================")
                console.log("STARTING");
                console.log("================>/initBackgroundLocation<================")
        
                // Get a reference to the plugin.
                let bgGeo = window.BackgroundGeolocation;
                
                // Listen to location events & errors.
                bgGeo.on('location', 
                    (location, taskId)=>{

                        try {

                            let coords = location.coords;
                            let lat    = coords.latitude;
                            let lng    = coords.longitude;

                            console.log("================>HERE<================")
                            console.log("LOCATION");
                            console.log(location);
                            console.log("================>/HERE<================")

                            // LocalNotifications.schedule({
                            //     id: Math.floor(Math.random()*1000000),
                            //     title: "BackgroundGeolocation:location PASS",
                            //     text: lat + ' ' + lng
                            // });

                            bgGeo.finish(taskId);

                        } catch (error) {
                            
                            console.log("ERROR => bgGeo.on('location)");
                            console.log(error);
                        }

                          
                        
                    },
                    (error)=>{
                        console.log(error)
                        // LocalNotifications.schedule({
                        //     id: Math.floor(Math.random()*1000000),
                        //     title: "BackgroundGeolocation:location ERROR",
                        //     text: error
                        // });
                    });
                
                // Fired whenever state changes from moving->stationary or vice-versa.
                bgGeo.on('motionchange', 
                    (isMoving)=>{

                        try {


                            console.log("================>motionchange<================")
                            console.log("MOTION CHANGE");
                            console.log(isMoving);
                            console.log("================>/motionchange<================")

                            // LocalNotifications.schedule({
                            //     id: Math.floor(Math.random()*1000000),
                            //     title: "BackgroundGeolocation:motionchange",
                            //     text: isMoving
                            // });

                            // POST
                            bgGeo.getCurrentPosition(
                                (location, taskId)=>{

                                    try {

                                        let coords = location.coords;
                                        let lat    = coords.latitude;
                                        let lng    = coords.longitude;

                                        console.log("================>getCurrentPosition<================")
                                        console.log("Got Location");
                                        console.log(location);
                                        console.log("================>/getCurrentPosition<================")


                                        // LocalNotifications.schedule({
                                        //     id: Math.floor(Math.random()*1000000),
                                        //     title: "BackgroundGeolocation:checkintoVenue:SUCCESS",
                                        //     text: "Logged into venue"
                                        // });


                                        this.venueService.checkintoVenue({
                                            lat: lat,
                                            lng: lng
                                        }).subscribe(
                                            i=>{
                                                console.log(i)
                                                // LocalNotifications.schedule({
                                                //     id: Math.floor(Math.random()*1000000),
                                                //     title: "BackgroundGeolocation:checkintoVenue:SUCCESS",
                                                //     text: "Logged into venue"
                                                // });
                                            },
                                            e=>{
                                                console.log(e)
                                                // LocalNotifications.schedule({
                                                //     id: Math.floor(Math.random()*1000000),
                                                //     title: "BackgroundGeolocation:checkintoVenue:FAILURE",
                                                //     text: "Failed to logged into venue"
                                                // });
                                            },
                                            ()=>{
                                                bgGeo.finish(taskId)
                                            }
                                        );

                                        // bgGeo.finish(taskId)

                                    } catch (error) {
                                        
                                        console.log("ERROR => bgGeo.getCurrentPosition");
                                        console.log(error);

                                    }

                                    
                                });





                        } catch (error) {
                            
                            console.log("ERROR => bgGeo.on('motionchange')");
                            console.log(error);

                        }

                        

                    });
            
                // BackgroundGeoLocation is highly configurable.
                // https://github.com/transistorsoft/cordova-background-geolocation/tree/master/docs

                console.log("++++++++++ABOUT TO CONFIGURE PLUGIN++++++++++")
                let config = {
                    // Geolocation config
                    desiredAccuracy: 0,
                    distanceFilter: 10,
                    stationaryRadius: 25,
                    locationUpdateInterval: 1000,
                    fastestLocationUpdateInterval: 5000,

                    // Activity Recognition config
                    activityType: 'Other',
                    activityRecognitionInterval: 5000,
                    stopTimeout: 5,

                    // Application config
                    debug: false,
                    stopOnTerminate: false,
                    startOnBoot: true

                };
                console.log(config);

                try {

                    bgGeo.configure(config, function(state) {
                        // This callback is executed when the plugin is ready to use.
                        console.log("=============bgGeo.configure==============");
                        console.log('BackgroundGeolocation ready: ', JSON.stringify(state));
                        if (!state.enabled) {

                            bgGeo.start();
                        }
                    });

                } catch (error) {
                    console.log("ERROR => bgGeo.configure");
                    console.log(error);
                }

                
            
        });

        
    }


    public mapStyle:any = [
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#e9e9e9"
              },
              {
                  "lightness": 17
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#f5f5f5"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 17
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 29
              },
              {
                  "weight": 0.2
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 18
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#f5f5f5"
              },
              {
                  "lightness": 21
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#dedede"
              },
              {
                  "lightness": 21
              }
          ]
      },
      {
          "elementType": "labels.text.stroke",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#ffffff"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "saturation": 36
              },
              {
                  "color": "#333333"
              },
              {
                  "lightness": 40
              }
          ]
      },
      {
          "elementType": "labels.icon",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#f2f2f2"
              },
              {
                  "lightness": 19
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#fefefe"
              },
              {
                  "lightness": 20
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#fefefe"
              },
              {
                  "lightness": 17
              },
              {
                  "weight": 1.2
              }
          ]
      }
  ]; 

}
