import {Component} from '@angular/core';
import {Platform, NavController, AlertController} from 'ionic-angular';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
import {WelcomePage} from '../welcome/welcome';

import {SettingsService} from '../../services/settings';
import {AuthService} from '../../services/auth';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';
import {AccountService} from '../../services/account';

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {
  APP_VERSION:string;
  enabledGeo:boolean = false;
  enabledPush:boolean = false;

  constructor(private nav: NavController,
              private iab: InAppBrowser,
              public push: Push,
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

  ionViewWillEnter() {
    this.platform.ready().then(()=>{
        this.checkGeoPermissions();
    });
  }

  checkGeoPermissions(){
    if(this.geoService.state){
      // console.log("Plugin is initiated so get the coords");
      this.enabledGeo = this.geoService.state.enabled;
    }else{
      // console.log("Plugin is not initiated");
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
        console.log("Plugin is not initiated, starting it");
        this.geoService.initBackgroundLocation();
      }

    });
  }

  togglePushPermissions(){
    this.platform.ready().then(()=>{

      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
        this.accountService.registerDevice(t.token);
      });

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
    this.nav.setRoot(WelcomePage);
    
  }


  sendFeedback(){
    this.iab.create(`mailto:s.tech.cornell@gmail.com?Subject=MoveMeant%20Feedback`, '_system');
  }  

  goToSite(){
    this.iab.create('http://cornelltech.io/', '_system');
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