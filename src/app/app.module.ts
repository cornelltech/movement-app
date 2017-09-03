import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { ChartsModule } from 'ng2-charts';
import {AgmCoreModule} from '@agm/core';

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

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'f37ad9eb'
  },
  'push': {
    'sender_id': 'SENDER_ID',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

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
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBa7UgG0KAlZShxva2Dyhg1Hhu7lh0BLSc'
    }),
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
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
    Push,

    SettingsService, 
    AuthService, 
    AccountService, 
    VenueService,
    GeoService,
    
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
