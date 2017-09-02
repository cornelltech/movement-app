import {Component} from '@angular/core';
import {Platform, NavController, AlertController} from 'ionic-angular';
// import {InAppBrowser, LocalNotifications, EmailComposer} from 'ionic-native';

import {SettingsService} from '../../services/settings';
import {AuthService} from '../../services/auth';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';
import {AccountService} from '../../services/account';

import {WelcomePage} from '../welcome/welcome';

declare var window: any;

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {
  APP_VERSION:string;
  enabled:boolean = false;

  constructor(private nav: NavController,
              public alertCtrl: AlertController,
              private platform:Platform,
              public authService: AuthService,
              public venueService: VenueService,
              public accountService:AccountService,
              public geoService:GeoService) {
                this.nav = nav;
                this.APP_VERSION = SettingsService.APP_VERSION;
                this.accountService.loadLoggedInUser();

                this.accountService.logEvent("page_enter_settings")
  }

  onPageWillEnter() {
    this.platform.ready().then(()=>{
        this.checkGeoPermissions();
    });
  }

  checkGeoPermissions(){
    if(this.geoService.state){
      // console.log("Plugin is initiated so get the coords");
      this.enabled = this.geoService.state.enabled;
    }else{
      // console.log("Plugin is not initiated");
    }
  }

  toggleGeoPermissions(){

    this.platform.ready().then(()=>{
      // console.log("===========toggleGeoPermissions===========");

      if(this.geoService.state){

        if(this.geoService.state.enabled){
          this.geoService.bgGeo.stop();
        }else{
          this.geoService.bgGeo.start();
        }

      }else{
        // console.log("Plugin is not initiated");
      }

    });
  }

  clear(){
    this.venueService.clearVenues();
  }

  signout(){
    if(this.geoService.state){
      this.geoService.bgGeo.stop();
    }
    this.clear()
    this.authService.removeToken();
    this.nav.popToRoot();
    
  }


  sendFeedback(){
    // InAppBrowser.open(`mailto:s.tech.cornell@gmail.com?Subject=MoveMeant%20Feedback`, '_system');
  }  

  goToSite(){
    // InAppBrowser.open('http://cornelltech.io/', '_system');
  }

  confirmSignout( ){
    let alert = this.alertCtrl.create({
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
    alert.present();
  }

  confirmLogsClear( ){
    let alert = this.alertCtrl.create({
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
    alert.present();
  }

}