import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, Alert} from 'ionic-angular';

import {AuthService} from '../../services/auth';
import {AccountService} from '../../services/account';

import {TabsPage} from '../tabs/tabs';


@Component({
  templateUrl: 'build/pages/welcome/welcome.html'
})
export class WelcomePage {
  
  @ViewChild('slider') slider: Slides;
  slideOptions = {
    initialSlide: 0
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
              public accountService: AccountService) {
                this.nav = nav;
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
        e => console.log(e),
        () => {}
      )
    }else{
      this.presentImpartialDataAlert();
    }
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

  presentImpartialDataAlert( ){
    let alert = Alert.create({
      title: 'Sorry',
      subTitle: 'Please fill out all the fields.',
      buttons: ['OK']
    });
    this.nav.present(alert);
  }

}
