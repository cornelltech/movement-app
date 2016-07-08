import {Component} from '@angular/core';
import {Platform, ionicBootstrap, Modal, NavController} from 'ionic-angular';
import {StatusBar, BackgroundGeolocation} from 'ionic-native';


import {provideLazyMapsAPILoaderConfig, GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';

import {WelcomePage} from './pages/welcome/welcome';
import {TabsPage} from './pages/tabs/tabs';

import {SettingsService} from './services/settings';
import {AuthService} from './services/auth';
import {AccountService} from './services/account';
import {VenueService} from './services/venues';

import {Storage, SqlStorage} from 'ionic-angular';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  rootPage:any;
  storage:Storage;

  constructor(private platform:Platform,
              public authService:AuthService,
              public venueService:VenueService) {
    this.authService.loadToken();
    this.routeToRootPage();

    platform.ready().then(() => {
      console.log("PLATFORM IS READY");

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

   
      // BackgroundGeolocation is highly configurable. See platform specific configuration options
      console.log("BackgroundGeo Configure");
      let config = {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };
      BackgroundGeolocation.configure(config)
        .then((location) => {
              console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
              // this.venueService.checkintoVenue({
              //   lat: location.latitude,
              //   lng: location.longitude
              // }).subscribe(
              //   i => {},
              //   e => {},
              //   () => {
              //     // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
              //     // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
              //     // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
              //     BackgroundGeolocation.finish(); // FOR IOS ONLY
              //   }
              // );
              BackgroundGeolocation.finish(); // FOR IOS ONLY
          })
        .catch((error) => {
              console.log('BackgroundGeolocation error');
              console.log(JSON.stringify(error));
          });

      // Turn ON the background-geolocation system.  
      // The user will be tracked whenever they suspend the app.
      BackgroundGeolocation.start();


    });
  }

  routeToRootPage(){
    this.storage = new Storage(SqlStorage);
    this.storage.get('token').then(t => {
      let authenticated = t ? true:false;
        if(authenticated){
          this.rootPage = TabsPage;
        }else{
          this.rootPage = WelcomePage;
        }
      });
  }

}

ionicBootstrap(MyApp, [GOOGLE_MAPS_PROVIDERS,
  provideLazyMapsAPILoaderConfig({ apiKey: 'AIzaSyBa7UgG0KAlZShxva2Dyhg1Hhu7lh0BLSc' }), 
  SettingsService, 
  AuthService, 
  AccountService, 
  VenueService])
