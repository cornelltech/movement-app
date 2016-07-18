import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Venue} from '../models/venue';

import {SettingsService} from './settings';
import {AuthService} from './auth';


@Injectable()
export class VenueService {
    storage:Storage;
    cohort:string = '';
    cohortVenues:Venue[] = [];
    venues:Venue[] = [];

    categories:string[] = [];
    data:number[] = [];

    
    constructor(public http: Http,
                public authService:AuthService){
                    this.storage = new Storage(SqlStorage);
    }

    fetchCohortVenues():Observable<any>{
        let options = this.authService.getProtectedHeader()
        return this.http.get(`${SettingsService.API_ENDPOINT}/venues/logs/`, options)
            .map(r => r.json() || []);
    }

    loadCohortVenues():void{

        this.fetchCohortVenues().subscribe(
            r => {
                
                this.cohort = r.cohort;
                this.cohortVenues = r.results

                console.log(this.cohortVenues)

                this.cohortVenues.map(v=>{
                    let pos = this.categories.indexOf(v.category);
                    if( pos > -1 ){
                        this.data[pos] += v.checkins;
                    }else{
                        this.categories.push(v.category);
                        this.data.push(1);
                    }
                })
            },
            e => console.log(e),
            () => {}
        );

    }

    fetchVenues(ids:any[]):Observable<any>{
        let queryIds = ids ? ids : [];
        let options = this.authService.getProtectedHeader()
        return this.http.get(`${SettingsService.API_ENDPOINT}/my/venues/logs/?ids=${queryIds.toString()}`, options)
            .map(r => r.json() || []);
    }

    loadVenues():void{
        console.log('==========>Loading Venues');
        this.storage.get('ids').then(ids=>{
            ids = ids? JSON.parse(ids) : [];
            console.log(ids);
            if(ids.length>0){
                this.fetchVenues(ids).subscribe(
                    r => this.venues = r,
                    e => console.log(e),
                    () => {}
                );
            }
        });
    }

    checkintoVenue(coords:any):Observable<any>{
        console.log("==========> [js] About to CHECK INTO VENUE")
        console.log(`==========> ${coords.lat} : ${coords.lng}`);
        let options = this.authService.getProtectedHeader()
        let body = JSON.stringify({
            'lat': coords.lat,
            'lng': coords.lng
        });
        return this.http.post(`${SettingsService.API_ENDPOINT}/venues/checkin/`, body, options)
            .map(r => r.json() || {})
            .map(r => {
                console.log("==========>LOOKEDUP THE PLACE");
                this.storage.get('ids').then(ids => {
                    ids = ids ? JSON.parse(ids) : [];
                    if( ids.indexOf(r.id) == -1 ){
                        console.log("==========>SAVING DA PLACE");
                        ids.push(r.id);
                        this.storage.set('ids', JSON.stringify(ids));
                        this.loadVenues();
                    }
                });
            });
    }

    signintoVenue(venue:Venue):Observable<any>{
        let options = this.authService.getProtectedHeader()
        let body = JSON.stringify({
            'venue_id': venue.id
        });
        return this.http.post(`${SettingsService.API_ENDPOINT}/venues/reveal/`, body, options)
            .map(r => r.json() || {});
    }

    clearVenues():void{
        this.storage.get('ids').then(ids => {
            this.storage.set('ids', JSON.stringify([]));
            this.venues = [];
        })
    }
}
