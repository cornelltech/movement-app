import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';



import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';


@Component({
  templateUrl: 'build/pages/cohort/cohort.html',
  directives: [GOOGLE_MAPS_DIRECTIVES]
})
export class CohortPage {

  public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';


  constructor(private nav: NavController,
              public venueService:VenueService) {
                this.nav = nav;
                this.loadData();
  }
  
  loadData(){
    console.log('load');
    this.venueService.loadCohortVenues();
  }

  clickedMarker(venue:Venue){
    console.log(venue);
  }

    

}
