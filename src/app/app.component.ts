import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import {AccountService} from './../services/account';

import {AuthService} from './../services/auth';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private authService:AuthService,
              public push:Push,
              public accountService: AccountService,
              public alertCtrl: AlertController,
              private storage:Storage) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.authService.loadToken();
      this.pushsetup();
      this.routeToRootPage();

    });
  }

  routeToRootPage(){
    this.storage.get('token').then(t => {
      let authenticated = t ? true:false;
        if(authenticated){
          console.log('authenticated');
          this.rootPage = TabsPage;

        }else{
          console.log('not authenticated');
          this.rootPage = WelcomePage;

        }
      });
  }
  pushsetup() {
  const options: PushOptions = {
   android: {},
   ios: {
       alert: 'true',
       badge: true,
       sound: 'false'
   },
   windows: {}
};

const pushObject: PushObject = this.push.init(options);

pushObject.on('notification').subscribe((notification: any) => {
  if (notification.additionalData.foreground) {
    let youralert = this.alertCtrl.create({
      title: 'New Push notification',
      message: notification.message
    });
    youralert.present();
  }
});

pushObject.on('registration').subscribe((registration: any) => {
  // alert(registration.registrationId);
  this.accountService.registerDevice(registration.registrationId);
  console.log("Saved Token:", registration.registrationId);
});

pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
}

}
