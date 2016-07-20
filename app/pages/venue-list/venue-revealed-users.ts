import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {GeoService} from '../../services/geo';

import {VenueService} from '../../services/venues';
import {Venue} from '../../models/venue';

@Component({
  template: `
  
  
  <ion-toolbar primary style="padding-top:20px">
    <ion-title style="padding-top:20px">{{venue.name}}</ion-title>
    
    <ion-buttons end>
      <button (click)="close()">
        <ion-icon name="close"></ion-icon>
      </button>
    </ion-buttons>

  </ion-toolbar>

  <ion-content style="margin-top:44px;">
    
    <sebm-google-map    [latitude]="venue.lat" 
                        [longitude]="venue.lng" 
                        [zoom]="15" 
                        [zoomControl]="false"
                        [usePanning]="true"
                        [disableDefaultUI]="true"
                        [streetViewControl]="false"
                        [scrollwheel]="false"
                        [styles]="geoService.mapStyle">
        
        <sebm-google-map-marker [iconUrl]="iconUrl"
                                [latitude]="venue.lat"  
                                [longitude]="venue.lng"></sebm-google-map-marker>
        
      </sebm-google-map>

    <div padding style="display: flex;
    align-items: center;
    justify-content: center;">
      
      <div item-center class="progress-container" style="height:120px; width:120px; border-radius:60px;">
        <div class="progress-indicator animated fadeIn" style="height:100px; width:100px; border-radius:60px;">
          <div class="progress-filled" [style.height]="getFill(venue)" style="border-top-right-radius:60px; border-top-left-radius:60px;"></div>
        </div>
      </div>  


    </div>

    <ion-list>
      <ion-list-header>
        {{venue.reveals}} out of {{venue.checkins}} have revealed themselves
      </ion-list-header>
      <ion-item *ngFor="let user of venue.revealed_users">
        {{user}}
      </ion-item>
    </ion-list>
  </ion-content>`,
  styles: [`
  .sebm-google-map-container {
       height: 150px;
       touch-action: none;
       pointer-events: none;
    }`],
  directives: [CHART_DIRECTIVES, GOOGLE_MAPS_DIRECTIVES]
})
export class RevealedUserListModal {
  venue:Venue;
  iconUrl:string ="imgs/venue.png";
  chartType:string = 'pie';
  chartLabels:string[] =[];
  chartData:number[] = [];
  chartOptions:any = {
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    responsive: false,
    legend: {
      display: true,
      position: 'bottom',
      fullWidth: true
    }
  };

  dataLoaded:boolean = false

  constructor(private viewCtrl: ViewController,
              public params: NavParams,
              public venueService: VenueService,
              public geoService:GeoService) {
                //  console.log(params.data.venue);
                 this.venue = params.data.venue;

                 this.chartLabels = ['Revealed', 'Visited'];
                 this.chartData = [this.venue.reveals, this.venue.checkins];
                 
  }


  getFill(venue:Venue):string{
    return this.venueService.calculateFillPercent(venue, 100) + 'px';
  }
  

  close() {
    this.viewCtrl.dismiss();
  }
}