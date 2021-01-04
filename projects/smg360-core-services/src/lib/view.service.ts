import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from './cache.service';
import { CacheType } from './enums/cacheType.enum';
import { Views } from './enums/views.enum';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  _mode: any = Views.Full;
  subscribers: any = [];
  adminUserCacheKey = 'current-admin-user';
  menuSelector;
  
  constructor(private cacheService:CacheService,
    private router:Router) { }

  getCurrentViewFeatures():any {
    var siteSettings = {};

    switch (this._mode) {
        case Views.Pod:
            siteSettings = this.getPodSiteSettings();
            break;
        case Views.Embedded:
            siteSettings = this.getEmbeddedSiteSettings();
            break;
        case Views.Demo:
            siteSettings = this.getDemoSiteSettings();
            break;
        default:
            siteSettings = this.getFullSiteSettings();
    }
    return siteSettings;
}

checkAdminBanner(value){
  if(this.cacheService){
      let currentUser = this.cacheService.get(CacheType.UserMeta, this.adminUserCacheKey);
      if(!currentUser) return value;
      return currentUser.isAdmin?false: value;
  }else{
      return false;
  }
}

subscribe(callback) {
  if (!callback || typeof callback !== "function") {
      return;
  }

  this.subscribers.push(callback);
}

unsubscribe(callback) {
  if (!callback || typeof callback !== "function") {
      return;
  }

  const callbackIndex = this.subscribers.indexOf(callback);

  if (callbackIndex >= 0) {
      this.subscribers.splice(callbackIndex, callbackIndex + 1);
  }
}

notifySubscribers(mode, siteSettings) {
  this.subscribers.forEach(function (callback) {
      callback({
          mode: mode, siteSettings: siteSettings
      });
  });
}

getMode() {
  return this._mode;
}

setMode(mode) {
  const modeChanged = this._mode != mode;

  switch (mode) {
      case Views.Pod:
          this._mode = Views.Pod;
          break;
      case Views.Embedded:
          this._mode = Views.Embedded;
          break;
      case Views.Demo:
          this._mode = Views.Demo;
          break;
      default:
          this._mode = Views.Full;
  }

  if (modeChanged) {
      this.notifySubscribers(this._mode, this.getCurrentViewFeatures());
  }
}

getPodSiteSettings() {
  return Object.freeze({
      "leftMenu": false,
      "topMenu": false,
      "banner": false,
      "commentAggregate": false,
      "commentPadding": false,
      "commentHeader": false,
      "commentTitle": true,
      "commentSubtitle": true,
      "showFooter": true,
      "commentInfiniteScroll": false,
      "timeoutDialog": false,
      "search": false,
      "commentTAPods": false,
      "configButton": false,
      "commentFilter": false,
      "breadcrumb": false,
      "dashboard": false,
      "commentFilterClose": false,
      "dynamicWidth": true,
      "redirectToClassicReportingSite": true,
      "interactiveDetails": false,
      "facetBar": false,
      "sort": false,
      "fullCardView": this.getDisplayMode()
  });
}

getEmbeddedSiteSettings() {
  return Object.freeze({
      "leftMenu": false,
      "topMenu": false,
      "banner": false,
      "commentAggregate": true,
      "commentPadding": true,
      "commentHeader": true,
      "commentTitle": false,
      "commentSubtitle": false,
      "showFooter": false,
      "commentInfiniteScroll": true,
      "timeoutDialog": false,
      "search": true,
      "commentTAPods": true,
      "configButton": false,
      "commentFilter": true,
      "breadcrumb": true,
      "dashboard": true,
      "commentFilterClose": true,
      "dynamicWidth": false,
      "redirectToClassicReportingSite": true,
      "interactiveDetails": true,
      "facetBar": true,
      "sort": true,
      "fullCardView": this.getDisplayMode()
  });
}

getFullSiteSettings() {
  return Object.freeze({
      "leftMenu": true,
      "leftMenuLinks": {
          "dashboard": true,
          "commentReport": true,
          "V5Link": true,
          "feedback": true,
          "logOut": true
      },
      "topMenu": true,
      "banner": this.checkAdminBanner(true),
      "commentAggregate": true,
      "commentPadding": true,
      "commentHeader": true,
      "commentTitle": false,
      "commentSubtitle": true,
      "showFooter": false,
      "commentInfiniteScroll": true,
      "timeoutDialog": true,
      "commentFilter": false,
      "commentFilterClose": false,
      "search": true,
      "commentTAPods": true,
      "configButton": true,
      "breadcrumb": true,
      "dashboard": false,
      "dynamicWidth": true,
      "redirectToClassicReportingSite": false,
      "interactiveDetails": true,
      "facetBar": true,
      "sort": true,
      "fullCardView": this.getDisplayMode()
  });
}

getDemoSiteSettings() {
  return Object.freeze({
      "leftMenu": true,
      "leftMenuLinks": {
          "dashboard": false,
          "commentReport": true,
          "V5Link": false,
          "feedback": true,
          "logOut": true
      },
      "topMenu": true,
      "banner": this.checkAdminBanner(true),
      "commentAggregate": true,
      "commentPadding": true,
      "commentHeader": true,
      "commentTitle": false,
      "commentSubtitle": true,
      "showFooter": false,
      "commentInfiniteScroll": true,
      "timeoutDialog": true,
      "commentFilter": false,
      "commentFilterClose": false,
      "search": true,
      "commentTAPods": true,
      "configButton": true,
      "breadcrumb": true,
      "dashboard": false,
      "dynamicWidth": true,
      "redirectToClassicReportingSite": false,
      "interactiveDetails": true,
      "facetBar": true,
      "sort": true,
      "fullCardView": this.getDisplayMode()
  });
}

getDisplayMode() {
  var location = this.router.url;
  var fullCardView = location && location.indexOf('/card/') > -1;
  return fullCardView;
}

registerNavMenuItemSelector(callback) {
    this.menuSelector = callback
}
}
