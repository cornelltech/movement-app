import {Component} from '@angular/core';
import {NavController, ModalController, ViewController, NavParams, Alert, Modal} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';
import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';


import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';
import {AccountService} from '../../services/account';
import {RevealedUserListModal} from './venue-revealed-users';

@Component({
  templateUrl: 'build/pages/venue-list/venue-list.html',
  directives: [GOOGLE_MAPS_DIRECTIVES]
})
export class VenueListPage {
  constructor(private nav: NavController,
              public venueService:VenueService,
              public accountService: AccountService,
              public geoService:GeoService,
              public modalCtrl: ModalController) {
                this.nav = nav;
                this.loadVenues();

                console.log("------------------------")
                console.log("Hello World")

  }
  
  iconUrl:string ="imgs/venue.png";

  loadVenues(){
    this.venueService.loadVenues()
  }

  getFill(venue:Venue):string{
    return this.venueService.calculateFillPercent(venue, 30) + 'px';
  }

  showModal(venue:Venue) {
    let modal = this.modalCtrl.create(RevealedUserListModal, { venue: venue });
    modal.present(modal);
  }

  haveIBeenThere(venue:Venue){
    if(venue.revealed){
      return "1.0";
    }else{
      return "0.5";
    }
  }


  debug(){
    this.venueService.checkintoVenue({lat: 40.741139, lng: -74.002845}).subscribe(
      i=>{},
      e=>{},
      ()=>{}
    )
  }

}
