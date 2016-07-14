import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, Alert} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';

import {AuthService} from '../../services/auth';
import {AccountService} from '../../services/account';
import {GeoService} from '../../services/geo';

import {TabsPage} from '../tabs/tabs';


@Component({
  templateUrl: 'build/pages/welcome/welcome.html'
})
export class WelcomePage {
  
  @ViewChild('slider') slider: Slides;
  slideOptions = {
    initialSlide: 0
    // TODO - figure out how to prevent swipes, but only button nav
  };
  credentials:any = {
    username: '',
    email: '',
    password: ''
  };
  zipcode:number;
  cohort:string;

  signupMode:boolean=true;

  constructor(private nav: NavController,
              public authService: AuthService,
              public accountService: AccountService,
              public geoService: GeoService) {
                this.nav = nav;                
               }
  
  enableNotificaiton(){
    LocalNotifications.schedule({
        id: 1,
        text: "Push Enabled"
    });
  }

  slideNext(){
    console.log('next');
    // this.slider.slideNext();
    this.slider.slideNext();
    // let swiper = this.slider.getSlider();
    // swiper.slideNext(true, 100);
  }

  toggleMode(){
    this.signupMode = !this.signupMode;
  }

  submitForm(){
    if(this.signupMode){
      this.doSignup();
    }else{
      this.doLogin();
    }
  }

  doLogin(){
    if( this.credentials.username && this.credentials.password ){
      this.authService.login({
        username: this.credentials.username,
        password: this.credentials.password
      }).subscribe(
        i => {
          if(this.signupMode){
            this.slider.slideNext();
          }else{
            this.goToApp()
          }
        },
        e => this.presentAlert(),
        () => { }
      );
    }else{
      this.presentImpartialDataAlert();
    }
  }

  doSignup(){
    if(this.credentials.username && this.credentials.email && this.credentials.password){
      
      this.authService.createAccount(
        this.credentials.username,
        this.credentials.email,
        this.credentials.password
      ).subscribe(
        i => this.doLogin(),
        e => this.presentAlert(),
        () => {}
      );

    }else{
      this.presentImpartialDataAlert();
    }
  }

  setZipCode(){
    if(this.zipcode){
      this.accountService.associateZipcode(this.zipcode).subscribe(
        i => {
          this.cohort = i.cohort;
          this.slider.slideNext();
        },
        e => this.presentInvalidZipcodeAlert(),
        () => {}
      )
    }else{
      this.presentImpartialDataAlert();
    }
  }

  enableVisitTracking(){
    this.geoService.initBackgroundLocation();
    // this.geoService.startMonitoringVisits();
    this.slideNext();
  }

  goToApp(){
    this.nav.setRoot(TabsPage);
  }


  presentAlert( ){
    let alert = Alert.create({
      title: 'Sorry',
      subTitle: 'We were unable to sign you in, please try again.',
      buttons: ['OK']
    });
    this.nav.present(alert);
  }

  presentInvalidZipcodeAlert(){
    let alert = Alert.create({
      title: 'Sorry',
      subTitle: 'Movemeant is not availible in your region at the moment',
      buttons: ['OK']
    });
    this.nav.present(alert);
  }

  presentImpartialDataAlert( ){
    let alert = Alert.create({
      title: 'Sorry',
      subTitle: 'Please fill out all the fields.',
      buttons: ['OK']
    });
    this.nav.present(alert);
  }

}
