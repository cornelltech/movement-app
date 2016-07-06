import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {SettingsService} from './settings';
import {AuthService} from './auth';


@Injectable()
export class AccountService {

    constructor(public http: Http,
                public auth:AuthService){

    }


    associateZipcode(zipcode:number):Observable<any>{
        let options = this.auth.getProtectedHeader()
        let body = JSON.stringify({ zipcode: zipcode });
        return this.http.post(`${SettingsService.API_ENDPOINT}/cohorts/affiliate/`, body, options)
                        .map(r => r.json())
    }

}
