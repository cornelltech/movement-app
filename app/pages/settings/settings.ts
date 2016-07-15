import {Component} from '@angular/core';
import {NavController, Alert} from 'ionic-angular';
import {BackgroundGeolocation} from 'ionic-native';

import {SettingsService} from '../../services/settings';
import {AuthService} from '../../services/auth';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';

import {WelcomePage} from '../welcome/welcome';

@Component({
  templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
  APP_VERSION:string;
  enabled:boolean = false;

  constructor(private nav: NavController,
              public authService: AuthService,
              public venueService: VenueService,
              public geoService:GeoService) {
                this.nav = nav;
                this.APP_VERSION = SettingsService.APP_VERSION;

                this.checkGeoPermissions();
  }

  checkGeoPermissions(){
    this.geoService.isEnabled()
      .then((enabled)=>{
        this.enabled = enabled ? true:false;
      });
  }
  toggleGeoPermissions(){
    this.geoService.isEnabled()
      .then((enabled)=>{
        this.enabled = enabled ? true:false;

        if(this.enabled){
          console.log("TURN OFFO")

        }else{
          console.log("TURN ON")
        }

      });
  }

  signout(){
    this.authService.removeToken();
    this.nav.rootNav.setRoot(WelcomePage);
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
