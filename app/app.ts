import {Component} from '@angular/core';
import {Platform, ionicBootstrap, Modal, NavController} from 'ionic-angular';
import {StatusBar, Keyboard, BackgroundGeolocation} from 'ionic-native';

import {provideLazyMapsAPILoaderConfig, GOOGLE_MAPS_PROVIDERS} from 'angular2-google-maps/core';

import {WelcomePage} from './pages/welcome/welcome';
import {TabsPage} from './pages/tabs/tabs';

import {SettingsService} from './services/settings';
import {AuthService} from './services/auth';
import {AccountService} from './services/account';
import {VenueService} from './services/venues';
import {GeoService} from './services/geo';

import {Storage, SqlStorage} from 'ionic-angular';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  rootPage:any;
  storage:Storage;

  constructor(private platform:Platform,
              public authService:AuthService,
              public venueService:VenueService,
              public geoService:GeoService) {
    this.authService.loadToken();
    this.routeToRootPage();

    platform.ready().then(() => {
      console.log("PLATFORM IS READY");

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleLightContent();

      // Disable scroll on keyboard
      Keyboard.disableScroll(true);

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

ionicBootstrap(MyApp, [
  GOOGLE_MAPS_PROVIDERS,
  provideLazyMapsAPILoaderConfig({ apiKey: 'AIzaSyBa7UgG0KAlZShxva2Dyhg1Hhu7lh0BLSc' }),
  SettingsService, 
  AuthService, 
  AccountService, 
  VenueService,
  GeoService],
  {
    scrollAssist: false,
    autoFocusAssist: true
});
