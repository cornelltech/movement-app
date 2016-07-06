import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {SettingsService} from './settings';

@Injectable()
export class VenueService {
    tokenUrl:string = '/api-token-auth/'

    constructor(public http: Http){

    }

}
