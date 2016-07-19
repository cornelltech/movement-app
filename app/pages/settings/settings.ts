import {Component} from '@angular/core';
import {Platform, NavController, Alert} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';

import {SettingsService} from '../../services/settings';
import {AuthService} from '../../services/auth';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';

import {WelcomePage} from '../welcome/welcome';

declare var window: any;

@Component({
  templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
  APP_VERSION:string;
  enabled:boolean = false;

  constructor(private nav: NavController,
              private platform:Platform,
              public authService: AuthService,
              public venueService: VenueService,
              public geoService:GeoService) {
                this.nav = nav;
                this.APP_VERSION = SettingsService.APP_VERSION;
  }

  onPageWillEnter() {
    this.platform.ready().then(()=>{
        this.checkGeoPermissions();
    });
  }

  checkGeoPermissions(){
    if(this.geoService.state){
      console.log("Plugin is initiated so get the coords");
      this.enabled = this.geoService.state.enabled;
    }else{
      console.log("Plugin is not initiated");
    }
  }

  toggleGeoPermissions(){

    this.platform.ready().then(()=>{
      console.log("===========toggleGeoPermissions===========");

      if(this.geoService.state){

        if(this.geoService.state.enabled){
          this.geoService.bgGeo.stop();
        }else{
          this.geoService.bgGeo.start();
        }

      }else{
        console.log("Plugin is not initiated");
      }

    });
  }

  signout(){
    if(this.geoService.state){
      this.geoService.bgGeo.stop();
    }
    this.authService.removeToken();
    
    this.nav.rootNav.setRoot(WelcomePage)
      .then(()=>{ this.nav.popToRoot(); });
  }

  clear(){
    this.venueService.clearVenues();
  }

  confirmSignout( ){
    let alert = Alert.create({
      title: 'Are you sure?',
      subTitle: 'Are you sure you want to sign out?',
      buttons: [{
        text: 'Cancel',
        handler: data => {} 
      },{
        text: 'Confirm',
        handler: data => {
          this.signout();
        }
      }]
    });
    this.nav.present(alert);
  }

  confirmLogsClear( ){
    let alert = Alert.create({
      title: 'Are you sure?',
      subTitle: `If you erase your local logs, you won't be able to recover them.`,
      buttons: [{
        text: 'Cancel',
        handler: data => {} 
      },{
        text: 'Confirm',
        handler: data => {
          this.clear();
        }
      }]
    });
    this.nav.present(alert);
  }

}
