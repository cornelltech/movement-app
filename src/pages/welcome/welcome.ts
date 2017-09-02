import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, AlertController} from 'ionic-angular';
// import {InAppBrowser} from 'ionic-native';

import {AuthService} from '../../services/auth';
import {AccountService} from '../../services/account';
import {GeoService} from '../../services/geo';

import {TabsPage} from '../tabs/tabs';


@Component({
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  currentSlide = 0;
  swiper:any;

  @ViewChild('slider') slider: Slides;
  slidesOptions = {
    initialSlide: 0,
    onlyExternal: false
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
              public alertCtrl: AlertController,
              public authService: AuthService,
              public accountService: AccountService,
              public geoService: GeoService) {
                this.nav = nav;
               }
  
    
  
  onSlideWillChange(event){
    
  }
  onSlideDidChange(event){

  }

  onIonDrag(event){
    this.swiper = event;
    this.swiper.lockSwipes();
  }

  slideNext(){
    if(this.swiper){
      this.swiper.unlockSwipes();
    }
    this.slider.slideNext();
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
        username: this.credentials.username.toLowerCase().replace(' ', '_'),
        password: this.credentials.password
      }).subscribe(
        i => {
          if(this.signupMode){

            this.accountService.logEvent('consent_given');

            this.slideNext();
          }else{
            this.goToApp()
          }
        },
        e => this.presentLoginAlert(),
        () => { }
      );
    }else{
      this.presentImpartialDataAlert();
    }
  }

  openPrivacy(){
    // InAppBrowser.open('https://s.tech.cornell.edu/MoveMeant/privacy.html', '_system');
  }
  openTerms(){ 
    // InAppBrowser.open('https://s.tech.cornell.edu/MoveMeant/terms.html', '_system');
  }

  doSignup(){
    if(this.credentials.username && this.credentials.email && this.credentials.password){
      
      this.authService.createAccount(
        this.credentials.username.toLowerCase().replace(' ', '_'),
        this.credentials.email.toLowerCase(),
        this.credentials.password
      ).subscribe(
        i => this.doLogin(),
        e => this.presentSignupAlert(),
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
          this.slideNext();
        },
        e => this.presentInvalidZipcodeAlert(),
        () => {}
      )
    }else{
      this.presentImpartialDataAlert();
    }
  }

  enableVisitTracking(){
    this.geoService.initBackgroundLocation()
      .then(()=>{
        this.slideNext();
      }, ()=>{
        alert("Movemeant won't work well without this.");
      })
    
  }

  goToApp(){
    this.nav.setRoot(TabsPage);
  }

  presentLoginAlert( ){
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: 'We were unable to sign you in, please try again.',
      buttons: ['OK']
    });
    alert.present();
  }

  presentSignupAlert( ){
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: 'This username seems to be taken.',
      buttons: ['OK']
    });
    alert.present();
  }
  

  presentInvalidZipcodeAlert(){
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: 'Movemeant is not availible in your region at the moment',
      buttons: ['OK']
    });
    alert.present();
  }

  presentImpartialDataAlert( ){
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: 'Please fill out all the fields.',
      buttons: ['OK']
    });
    alert.present();
  }


  presentConsentAlert(){
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      subTitle: 'MoveMeant is a research project from Cornell Tech. We require informed consent for you to use the app. You can delete the app if you do not wish to take part',
      buttons: ['OK']
    });
    alert.present();
  }

}