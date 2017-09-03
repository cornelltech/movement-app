import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';


import { MyApp } from './app.component';
import { CohortPage } from '../pages/cohort/cohort';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { VenueListPage } from '../pages/venue-list/venue-list';
import { RevealedUserListModal } from '../pages/venue-list/venue-revealed-users';
import { WelcomePage } from '../pages/welcome/welcome';


import {SettingsService} from './../services/settings';
import {AuthService} from './../services/auth';
import {AccountService} from './../services/account';
import {VenueService} from './../services/venues';
import {GeoService} from './../services/geo';


@NgModule({
  declarations: [
    MyApp,
    CohortPage,
    SettingsPage,
    TabsPage,
    VenueListPage,
    RevealedUserListModal,
    WelcomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CohortPage,
    SettingsPage,
    TabsPage,
    VenueListPage,
    RevealedUserListModal,
    WelcomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,

    SettingsService, 
    AuthService, 
    AccountService, 
    VenueService,
    GeoService,
    
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
