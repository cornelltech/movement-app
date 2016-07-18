import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {Venue} from '../../models/venue';

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

  <ion-content style="margin-top:44px;">
    
    <base-chart class="chart"
                  [data]="chartData"
                  [labels]="chartLabels"
                  [chartType]="chartType"
                  [options]="chartOptions"></base-chart>
    
    <ion-list>
      <ion-list-header>
        Revealed Users
      </ion-list-header>
      <ion-item *ngFor="let user of venue.revealed_users">
        {{user}}
      </ion-item>
    </ion-list>
  </ion-content>`,
  directives: [CHART_DIRECTIVES]
})
export class RevealedUserListModal {
  venue:Venue;
  chartType:string = 'pie';
  chartLabels:string[] =[];
  chartData:number[] = [];
  chartOptions:any = {
    animation: false,
    responsive: false,
  };
  dataLoaded:boolean = false

  constructor(private viewCtrl: ViewController,
             public params: NavParams) {
                 console.log(params.data.venue);
                 this.venue = params.data.venue;

                 this.chartLabels = ['Revealed', 'Visited'];
                 this.chartData = [this.venue.reveals, this.venue.checkins];
  }

  

  close() {
    this.viewCtrl.dismiss();
  }
}