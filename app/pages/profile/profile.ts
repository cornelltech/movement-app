import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {AccountService} from '../../services/account';


@Component({
  templateUrl: 'build/pages/profile/profile.html'
})
export class ProfilePage {
  constructor(private nav: NavController,
              public accountService:AccountService) {
                this.nav = nav;
                this.accountService.loadLoggedInUser();
  }
}
