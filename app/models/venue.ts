import {Account} from './account';

export class Venue{
    id:number;
    foursquare_id:string;
    
    name:string;
    category:string;

    checkins:number;

    lat:number;
    lng:number;
    
    revealed:boolean;
    reveals:number;
    revealed_users:string[];
    
    constructor(){}
}