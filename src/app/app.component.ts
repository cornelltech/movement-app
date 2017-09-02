import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';

import {AuthService} from './../services/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              private authService:AuthService,
              private storage:Storage) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.authService.loadToken();
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
}

