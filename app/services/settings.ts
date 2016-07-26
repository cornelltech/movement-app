import {Injectable} from '@angular/core';

@Injectable()
export class SettingsService{
    public static DEBUG:boolean = true;
    public static API_VERSION:string = 'v1';
    public static API_ENDPOINT:string = `http://localhost:8100/api/${SettingsService.API_VERSION}`;
    // public static API_ENDPOINT:string = `http://ec2-107-23-148-64.compute-1.amazonaws.com/api/${SettingsService.API_VERSION}`;
    public static APP_VERSION:string = '0.9.5';

    constructor(){ }
}