import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  setObjectItem(key: string, item: any): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  getObjectItem(key: string): object {
    var itemObject: any;
    var item = localStorage.getItem(key);
    if (item) {
      itemObject = JSON.parse(item);
    }
    return itemObject;
  }
  getItem(key:string):string{
    return localStorage.getItem(key);
  }
  remove(key:string):void{
    return localStorage.removeItem(key);
  }
}
