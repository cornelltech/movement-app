import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';


@Component({
  template: `
  <ion-content padding>
    <h2>I'm a modal!</h2>
    <button (click)="close()">Close</button>
  </ion-content>`
})
export class RevealedUsersModal {
  participants:string[]=[];

  constructor(private viewCtrl: ViewController,
             public params: NavParams) {
                 this.participants = params.data.participants;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}