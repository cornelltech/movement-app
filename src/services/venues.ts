import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage } from '@ionic/storage';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Venue} from '../models/venue';

import {SettingsService} from './settings';
import {AuthService} from './auth';


@Injectable()
export class VenueService {
    cohort:string = '';
    cohortVenues:Venue[] = [];
    venues:Venue[] = [];

    categories:string[] = [];
    data:number[] = [];

    
    constructor(public http: Http,
                public authService:AuthService,
                private storage:Storage){
    }

    fetchCohortVenues():Observable<any>{
        let options = this.authService.getProtectedHeader()
        return this.http.get(`${SettingsService.API_ENDPOINT}/venues/logs/`, options)
            .map(r => r.json() || []);
    }

    loadCohortVenues():void{

        this.fetchCohortVenues().subscribe(
            r => {

                // console.log(r)

                this.cohort = r.cohort;
                this.cohortVenues = r.results.filter(v=>{
                    return v.checkins > 1;
                });


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
            if(ids.length>0){

                this.fetchVenues(ids).subscribe(
                    r => {
                        this.venues = r;
                    },
                    e => console.log(e),
                    () => { }
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
        return this.http.post(`${SettingsService.API_ENDPOINT}/venues/search/`, body, options)
            .map(r => r.json() || {})
            .map(r => {
                console.log("==========>LOOKEDUP THE PLACE");
                this.storage.get('ids').then(ids => {
                    ids = ids ? JSON.parse(ids) : [];
                    if( ids.indexOf(r.id) == -1 ){
                        console.log("==========>SAVING DA PLACE");
                        ids.push(r.id);
                        this.storage.set('ids', JSON.stringify(ids));

                        // checkin to place
                        this.http.post(`${SettingsService.API_ENDPOINT}/venues/checkin/`, JSON.stringify({'venue_id': r.id}), options)
                            .subscribe(i=>{
                                console.log("checked in")
                            },e=>{
                                console.log("error in ")
                                console.log(e);
                            }, ()=>{
                                console.log('done');
                            })
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

    calculateFillPercent(venue:Venue, normalize:number){
        let checkins = venue.checkins;
        let reveals = venue.reveals;

        return normalize - Math.ceil( (reveals / checkins) * normalize )
    }

}