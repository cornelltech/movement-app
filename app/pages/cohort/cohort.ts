import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';

import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';
import {AccountService} from '../../services/account';
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
  
  youUrl:string = "imgs/location.png";
  iconUrl:string ="imgs/venue.png";

  constructor(private nav: NavController,
              public venueService:VenueService,
              public accountService: AccountService,
              public geoService:GeoService) {
                this.nav = nav;
                
                this.accountService.loadLoggedInUser();


  }


  onPageWillEnter() {
    // console.log("onPageWillEnter");
    this.getCurrentCoords();
    this.loadData();
  }

  syncCoords(){
    if(this.geoService.bgGeo){
      this.geoService.bgGeo.getCurrentPosition((location,taskId)=>{
      
        this.coords.lat = location.coords.latitude;
        this.coords.lng = location.coords.longitude;

        this.geoService.bgGeo.finish(taskId);

      }, (error)=>{console.log(error);});
    }
    
  }

  getFill(venue:Venue):string{
    return this.venueService.calculateFillPercent(venue, 30) + 'px';
  }

  getCurrentCoords(){
    console.log("getCurrentCoords()");
    if(this.geoService.state){
      console.log("Plugin is initiated so get the coords");
      this.syncCoords();
    }else{
      console.log("Plugin is not initiated so intiate it")
      this.geoService.initBackgroundLocation().then(()=>{
        this.syncCoords();
        console.log("Plugin configured and initialized");
      }, 
      ()=>{
        console.log("Unable to initializing the plugin");
      });
    }
  }
  
  loadData(){
    this.venueService.loadCohortVenues();
  }

  clickedMarker(venue:Venue){
    console.log('clicked it')
    // console.log(venue);
  }

  centerMap(venue:Venue){
    this.coords.lat = venue.lat;
    this.coords.lng = venue.lng;
  }

}
