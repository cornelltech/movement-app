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
    config:any = {
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
        debug: true,
        stopOnTerminate: false,
        startOnBoot: true

    };
    state:any = undefined;

    constructor(private platform:Platform,
                public venueService:VenueService){ }

    test(){
        // console.log("HERE IS WINDOW")
        // console.log(window);
    }

    initBackgroundLocation(){
        this.platform.ready().then(()=>{
  
            console.log("================>initBackgroundLocation<================")
            console.log("STARTING");
            console.log("================>/initBackgroundLocation<================")
    
            // Get a reference to the plugin.
            let bgGeo = window.BackgroundGeolocation;
                
            if(bgGeo){

                // Listen to location events & errors.
                bgGeo.on('location', 
                    (location, taskId)=>{

                        try {

                            let coords = location.coords;
                            let lat    = coords.latitude;
                            let lng    = coords.longitude;
                            // this.currentCoords.lat = lat;
                            // this.currentCoords.lng = lng;
                            console.log("================>:location<================")
                            console.log("LOCATION");
                            console.log(location);
                            console.log("================>/:location<================")

                            bgGeo.finish(taskId);

                        } catch (error) {
                            
                            console.log("ERROR => bgGeo.on('location)");
                            console.log(error);
                            bgGeo.finish(taskId);
                        }
  
                    },
                    (error)=>{
                        console.log(error)
                    });
                
                // Fired whenever state changes from moving->stationary or vice-versa.
                bgGeo.on('motionchange', 
                    (isMoving, location, taskId)=>{
                        try {
                            console.log("================>:motionchange<================")
                            console.log("MOTION CHANGE");
                            console.log(isMoving);
                            console.log("================>/:motionchange<================")

                            if(!isMoving){
                                let coords = location.coords;
                                let lat    = coords.latitude;
                                let lng    = coords.longitude;

                                this.venueService.checkintoVenue({
                                    lat: lat,
                                    lng: lng
                                }).subscribe(
                                    i=>{
                                        console.log(i);
                                    },
                                    e=>{
                                        console.log(e);
                                    },
                                    ()=>{
                                        bgGeo.finish(taskId);
                                    }
                                );
                            }else{
                                bgGeo.finish(taskId);
                            }
                            
                        } catch (error) {

                            console.log("ERROR => bgGeo.on('motionchange')");
                            console.log(error);
                            bgGeo.finish(taskId);

                        }

                    });
            
                // BackgroundGeoLocation is highly configurable.
                // https://github.com/transistorsoft/cordova-background-geolocation/tree/master/docs

                console.log("++++++++++ABOUT TO CONFIGURE PLUGIN++++++++++")
                try {
                    let Fetcher = window.BackgroundFetch;
                    if(Fetcher) {
                        Fetcher.configure(()=>{
                            console.log("Fetcher Initiated");
                            Fetcher.finish();
                        },
                        ()=>{
                            console.log("Fetcher Failed");
                        }, { 
                            stopOnTerminate: false 
                        });
                    }else{
                        console.log("window.BackgroundFetch Not found")
                    }
                    

                    bgGeo.configure(this.config, (state)=>{
                        // This callback is executed when the plugin is ready to use.
                        console.log("=============bgGeo.configure==============");
                        console.log('BackgroundGeolocation ready: ', JSON.stringify(state));
                        this.state = state;
                        if (!state.enabled) {
                            bgGeo.start();
                        }
                    });

                } catch (error) {
                    console.log("ERROR => bgGeo.configure");
                    console.log(error);
                }

            }else{
                console.log("Plugin not installed");
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
