import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';

// import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';
// import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';

import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';
import {AccountService} from '../../services/account';
import {GeoService} from '../../services/geo';
import {RevealedUserListModal} from '../venue-list/venue-revealed-users';


declare var window: any;

@Component({
  templateUrl: 'cohort.html',
//   directives: [CHART_DIRECTIVES, GOOGLE_MAPS_DIRECTIVES]
})
export class CohortPage {
  recentVenues:Venue[] = [];
  coords ={
            lat: 40.740837,
            lng: -74.001806
          };
  meCoords = {
            lat: 40.740837,
            lng: -74.001806
          }; 
  youUrl:string = "imgs/location.png";
  iconUrl:string ="imgs/venue.png";
  view_type:string = 'list';

  chartType:string = 'doughnut';		
   chartLabels:string[] =[];		
   chartData:number[] = [];		
   chartOptions:any = {		
     animation: {		
       animateRotate: true,		
       animateScale: true,		
     },		
     height: 300,		
     width: 300,		
     responsive: false,		
     legend: {		
         display: true,		
         position: 'bottom',		
         fullWidth: true		
       }		
   };		
   dataLoaded:boolean = false
   
  constructor(private nav: NavController,
              public venueService:VenueService,
              public accountService: AccountService,
              public geoService:GeoService,
              public modalCtrl: ModalController) {
                
                this.nav = nav;
                
                this.accountService.loadLoggedInUser();

  }


  onPageWillEnter() {
    // console.log("onPageWillEnter");
    this.getCurrentCoords();
    this.loadData();

    this.accountService.logEvent("page_enter_cohort")
  }

  syncCoords(){
    if(this.geoService.bgGeo){
      this.geoService.bgGeo.getCurrentPosition((location,taskId)=>{
      
        this.coords.lat = location.coords.latitude;
        this.coords.lng = location.coords.longitude;

        this.meCoords.lat = location.coords.latitude;
        this.meCoords.lng = location.coords.longitude;

        this.geoService.bgGeo.finish(taskId);

      }, (error)=>{console.log(error);});
    }
    
  }

  getFill(venue:Venue):string{
    return this.venueService.calculateFillPercent(venue, 30) + 'px';
  }

  getCurrentCoords(){
    // console.log("getCurrentCoords()");
    if(this.geoService.state){
      // console.log("Plugin is initiated so get the coords");
      this.syncCoords();
    }else{
      // console.log("Plugin is not initiated so intiate it")
      this.geoService.initBackgroundLocation().then(()=>{
        this.syncCoords();
        // console.log("Plugin configured and initialized");
      }, 
      ()=>{
        // console.log("Unable to initializing the plugin");
      });
    }
  }
  
  loadData(){
    this.dataLoaded = false;
    this.venueService.loadCohortVenues();
    this.venueService.loadVenues();
    this.chartLabels = this.venueService.categories;		
    this.chartData = this.venueService.data;
 		
     // PATCH-JOB		
     setTimeout(()=>{		
       this.dataLoaded = true;	
     }, 1000)

    
  }

  onSelectChange(type:any){
    console.log("type is: "+type);
    if(type == "pop"){
      this.venueService.cohortVenues = this.venueService.cohortVenues.sort(function(a,b){if(a.checkins < b.checkins) return 1; else if(a.checkins > b.checkins) return -1; else return 0;});
      console.log("pop sort");
    }
    else if(type == "loc"){
      for(let venue of this.venueService.cohortVenues){
      venue.distance = ((venue.lat-this.meCoords.lat)*(venue.lat-this.meCoords.lat)+(venue.lng-this.meCoords.lng)*(venue.lng-this.meCoords.lng));
      }
      this.venueService.cohortVenues = this.venueService.cohortVenues.sort(function(a,b){if(a.distance < b.distance) return -1; else if(a.distance > b.distance) return 1; else return 0;});
      console.log("dist sort");
    }
    else if(type == "type"){
      this.venueService.cohortVenues = this.venueService.cohortVenues.sort(function(a,b){if(a.category < b.category) return -1; else if(a.category > b.category) return 1; else return 0;});
      console.log("type sort");
    }

    else if(type == "recent"){
      this.venueService.cohortVenues = this.recentVenues;
    }
  }

  clickedMarker(venue:Venue){
    this.showModal(venue);
  }

  centerMap(venue:Venue){
    this.coords.lat = venue.lat;
    this.coords.lng = venue.lng;
  }

  showModal(venue:Venue) {
    let modal = this.modalCtrl.create(RevealedUserListModal, { venue: venue });
    modal.present();
  } 

  haveIBeenThere(venue:Venue){
    let flag = false;
    this.venueService.venues.forEach(v=>{ 
      if(v.id == venue.id){ flag = true; }
    });
    if(flag){
      return "1.0";
    }else{
      return "0.5";
    }
  }

}