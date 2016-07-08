import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';

import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';


@Component({
  templateUrl: 'build/pages/cohort/cohort.html',
  directives: [GOOGLE_MAPS_DIRECTIVES]
})
export class CohortPage {

  coords = {
    lat: 40.740837,
    lng: -74.001806
  }

  public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';


  constructor(private nav: NavController,
              public venueService:VenueService,
              public geoService:GeoService) {
                this.nav = nav;
                this.loadData();
  }
  
  loadData(){
    console.log('load');
    this.venueService.loadCohortVenues();
  }

  clickedMarker(venue:Venue){
    console.log('clicked it')
    console.log(venue);
  }

  centerMap(venue:Venue){
    this.coords.lat = venue.lat;
    this.coords.lng = venue.lng;
  }

}
