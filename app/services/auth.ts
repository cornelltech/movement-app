import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Storage, SqlStorage} from 'ionic-angular';

import {SettingsService} from './settings';

@Injectable()
export class AuthService {
    tokenUrl:string = '/api-token-auth/'
    createAccountUrl:string = '/participants/add/'

    storage:Storage;
    token:string = '';
    isAuthenticated:boolean = false;

    constructor(public http: Http){
        this.storage = new Storage(SqlStorage);
    }

    loadToken(){
        this.storage.get('token').then(t => {
            this.isAuthenticated = t ? true:false;
            this.token = t ? t:'';
        });
    }

    setToken(token:string){
        this.storage.set('token', token);
        this.isAuthenticated = true;
        this.token = token;
    }

    removeToken(){
        this.storage.remove('token');
        this.isAuthenticated = false;
        this.token = '';
    }


    getProtectedHeader():RequestOptions{
        let headers = new Headers({ 
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}` 
        });
        let options = new RequestOptions({ headers: headers });
        return options;
    }

    getUnprotectedHeader():RequestOptions{
        let headers = new Headers({ 
            'Content-Type': 'application/json' 
        });
        let options = new RequestOptions({ headers: headers });
        return options;
    }



    getToken(username:string, password:string):Observable<any>{
        let options = this.getUnprotectedHeader()
        let body = JSON.stringify({ username: username, password: password });
        return this.http.post(`${SettingsService.API_ENDPOINT}${this.tokenUrl}`, body, options)
                        .map(r => r.json())
                        .map(t => this.setToken(t.token))
    }
    createAccount(username:string, email:string, password:string):Observable<any>{
        let options = this.getUnprotectedHeader()
        let body = JSON.stringify({ username: username, email: email, password: password });
        return this.http.post(`${SettingsService.API_ENDPOINT}${this.createAccountUrl}`, body, options)
    }

    

    login(credentials):Observable<any>{
        return Observable.create(observer => {
            this.getToken(credentials.username, credentials.password).subscribe(
                t => { 
                    observer.next();
                    observer.complete(); 
                },
                e => {
                    console.log('=============')
                    console.log(e) 
                    console.log('=============')
                    observer.error(e);
                    observer.complete(); 
                },
                () => {}
            );
        });
    }
    
}
