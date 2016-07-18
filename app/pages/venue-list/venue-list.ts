import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, Alert, Modal} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';
// import {GOOGLE_MAPS_DIRECTIVES} from 'angular2-google-maps/core';


import {Venue} from '../../models/venue';
import {VenueService} from '../../services/venues';
import {GeoService} from '../../services/geo';
import {RevealedUserListModal} from './venue-revealed-users';

@Component({
  templateUrl: 'build/pages/venue-list/venue-list.html',
  // directives: [GOOGLE_MAPS_DIRECTIVES]
})
export class VenueListPage {
  constructor(private nav: NavController,
              public venueService:VenueService,
              public geoService:GeoService) {
                this.nav = nav;
                this.loadVenues();                
  }

  loadVenues(){
    this.venueService.loadVenues()
  }

  signintoVenue(venue:Venue) {
    let alert = Alert.create({
      title: `Sign in to ${venue.name}`,
      subTitle: 'You are going to reveal yourself here',
      buttons: [{
        text: 'Cancel',
        handler: data => {
          }
      },{
        text: 'Ok',
        handler: data => {
            this.venueService.signintoVenue(venue).subscribe(
              i => {
                venue.revealed = true;
                venue.reveals += 1;
              },
              e => console.log(e),
              () => {}
            )
          }
      }]
    });
    this.nav.present(alert);
  }

  test(){
    console.log('test')
    
    // this.venueService.checkintoVenue({
    //   lat: 40.741118, 
    //   lng: -74.002972
    // }).subscribe(
    //   i => console.log(i),
    //   e => console.log(e),
    //   () => console.log('done')
    // );

    LocalNotifications.schedule({
        id: 1,
        text: "[mvm] TEST TEST",
        at: new Date(new Date().getTime() + 3600),
    });
  }

  showModal(venue:Venue) {
    let modal = Modal.create(RevealedUserListModal, { venue: venue });
    this.nav.present(modal);
  } 
}
