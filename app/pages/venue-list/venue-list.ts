import {Component} from '@angular/core';
import {NavController, ViewController, NavParams, Alert, Modal} from 'ionic-angular';
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
              public geoService:GeoService) {
                this.nav = nav;
                this.loadVenues();                
  }
  
  iconUrl:string ="imgs/venue.png";

  loadVenues(){
    this.venueService.loadVenues()
  }

  getFill(venue:Venue):string{
    return this.venueService.calculateFillPercent(venue, 40) + 'px';
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
                venue.revealed_users.push(this.accountService.me.username);

                this.showModal(venue);

              },
              e => console.log(e),
              () => {}
            )
          }
      }]
    });
    this.nav.present(alert);
  }

  showModal(venue:Venue) {
    let modal = Modal.create(RevealedUserListModal, { venue: venue });
    this.nav.present(modal);
  } 
}
