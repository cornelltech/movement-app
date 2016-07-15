import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
// import * as c3 from 'c3';


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

  constructor(private nav: NavController,
              public venueService:VenueService,
              public geoService:GeoService) {
                this.nav = nav;
                this.loadData();

                this.geoService.getCurrentCoords();

                this.coords = this.geoService.currentCoords;

                // var chart = c3.generate({
                //     bindto: '#chart',
                //     data: {
                //       columns: [
                //         ['data1', 30, 200, 100, 400, 150, 250],
                //         ['data2', 50, 20, 10, 40, 15, 25]
                //       ]
                //     }
                // });
  }

  onPageWillEnter() {
        this.geoService.getCurrentCoords();
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
