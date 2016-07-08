import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {Venue} from '../../models/venue';

// <ion-item *ngFor="let participant in venue.revealed_users">
//   {{ participant.username }}
// </ion-item>

@Component({
  template: `
  <ion-toolbar primary>
    <ion-title>{{venue.name}}</ion-title>
    <ion-buttons end>
      <button (click)="close()">
        <ion-icon name="close"></ion-icon>
      </button>
    </ion-buttons>

    
  </ion-toolbar>

  <ion-content>
    <ion-list>
      
    </ion-list>
  </ion-content>`
})
export class RevealedUserListModal {
  venue:Venue;

  constructor(private viewCtrl: ViewController,
             public params: NavParams) {
                 console.log(params.data.venue);
                 this.venue = params.data.venue;

  }

  close() {
    this.viewCtrl.dismiss();
  }
}