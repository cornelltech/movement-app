import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Account} from '../models/account';
import {SettingsService} from './settings';
import {AuthService} from './auth';


@Injectable()
export class AccountService {
    me:Account;

    constructor(public http: Http,
                public auth:AuthService){

    }


    associateZipcode(zipcode:number):Observable<any>{
        let options = this.auth.getProtectedHeader()
        let body = JSON.stringify({ zipcode: zipcode });
        return this.http.post(`${SettingsService.API_ENDPOINT}/cohorts/affiliate/`, body, options)
                        .map(r => r.json())
    }

    fetchMe():Observable<any>{
        let options = this.auth.getProtectedHeader()
        return this.http.get(`${SettingsService.API_ENDPOINT}/me/`, options)
                        .map(r => r.json())
    }

    loadLoggedInUser(){
        this.fetchMe().subscribe(
            r => this.me = r,
            e => console.log(e),
            () => {}
        );
    }

    logEvent(msg:string){
        let options = this.auth.getProtectedHeader()
        this.http.post(`${SettingsService.API_ENDPOINT}/events/`, JSON.stringify({ trigger: msg }), options)
            .map(r => r.json())
            .subscribe(
                i=>{},
                e=>{},
                ()=>{}
            )
    }

}
