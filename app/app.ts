import {Component} from '@angular/core';
import {Platform, ionicBootstrap, Modal, NavController} from 'ionic-angular';
import {StatusBar} from 'ionic-native';


import {WelcomePage} from './pages/welcome/welcome';
import {TabsPage} from './pages/tabs/tabs';

import {SettingsService} from './services/settings';
import {AuthService} from './services/auth';
import {AccountService} from './services/account';
import {VenueService} from './services/venues';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform,
              public authService:AuthService) {
    this.authService.loadToken();
    this.routeToRootPage();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  routeToRootPage(){
    let authenticated = this.authService.isAuthenticated;
    if(authenticated){
      this.rootPage = TabsPage;
    }else{
      this.rootPage = WelcomePage;
    }
  }

}

ionicBootstrap(MyApp, [SettingsService, AuthService, AccountService, VenueService])
