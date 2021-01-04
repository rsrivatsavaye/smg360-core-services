import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }
  
  get origin(){
    return window.location.origin;
  }
  get hash(){
    return window.location.hash;
  }
  set href(value:string){
    window.location.href = value;
  }

}
