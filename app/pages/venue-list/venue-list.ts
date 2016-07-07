import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import { GOOGLE_MAPS_DIRECTIVES } from 'angular2-google-maps/core';

import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';



@Component({
  templateUrl: 'build/pages/venue-list/venue-list.html',
  directives: [GOOGLE_MAPS_DIRECTIVES]
})
export class VenueListPage {
  constructor(private nav: NavController,
              public venueService:VenueService) {
                this.nav = nav;
                this.loadVenues();
                
  }



  loadVenues(){
    this.venueService.loadVenues()
  }

  test(){
    console.log('test')
    this.venueService.checkintoVenue({
      lat: 41.447519,
      lng: -72.496730
    }).subscribe(
      i => console.log(i),
      e => console.log(e),
      () => console.log('done')
    );
  }

}
