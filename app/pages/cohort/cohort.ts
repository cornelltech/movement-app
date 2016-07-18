import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
// import * as c3 from 'c3';


import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';

declare var window: any;

@Component({
  templateUrl: 'build/pages/cohort/cohort.html',
  directives: [GOOGLE_MAPS_DIRECTIVES]
})
export class CohortPage {

  coords ={
            lat: 40.740837,
            lng: -74.001806
          };

  constructor(private nav: NavController,
              public venueService:VenueService,
              public geoService:GeoService) {
                this.nav = nav;
                this.loadData();

                // this.getCurrentCoords();

  }

  onPageWillEnter() {
        // this.getCurrentCoords();
  }

  getCurrentCoords(){

      let bgGeo = window.BackgroundGeolocation;
  
      bgGeo.getState((state)=>{
        console.log(state);
        if(state.enabled){
          
          bgGeo.getCurrentPosition(
            (location, taskId)=>{
              let coords = location.coords;
              let lat    = coords.latitude;
              let lng    = coords.longitude;
              
              this.coords = {
                lat: lat,
                lng: lng
              };

              console.log("================>HERE<================")
              console.log(this.coords);
              console.log("================>HERE<================")
            
              bgGeo.finish(taskId);
          })
        }else{
          this.coords ={
            lat: 40.740837,
            lng: -74.001806
          };
        }
      });


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
