import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';


@Component({
  templateUrl: 'build/pages/cohort/cohort.html',
  directives: [GOOGLE_MAPS_DIRECTIVES]
})
export class CohortPage {
  constructor(private nav: NavController,
              public venueService:VenueService) {
                this.nav = nav;
                this.loadData();
  }

    loadData(){
      console.log('load');
      this.venueService.loadCohortVenues();
    }

}
