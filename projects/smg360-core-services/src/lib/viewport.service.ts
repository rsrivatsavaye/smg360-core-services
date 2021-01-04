import { EventEmitter, Injectable } from '@angular/core';
import { ResolutionService } from './resolution.service';
import { ViewService } from './view.service';
import * as EventNames from './contstants/event-names.constants';
import { Views } from './enums/views.enum';
import { Resolutions } from './enums/resolutions.enum';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewportService {

  isSideBarExpanded: boolean;
  options: any = { isLoading: false };
  activeResolutionChangeCallbacks: any = [];
  viewportSubscribers: any = [];
  resolution: any;

  // resolutionChanged:EventEmitter<any> = new EventEmitter<any>();
  // sidebarExpandedState= new BehaviorSubject(undefined);
  // viewSettingsChanged = new BehaviorSubject(undefined);

  constructor(private resolutionService: ResolutionService,
    private viewService: ViewService) {
    this.activate();
    this.isSideBarExpanded = true;
  }

  activate() {
    this.resolution = this.resolutionService.Get();
    this.subscribeToResolutionChange(() => { this.broadcastSidebarExpandedState() });
    this.viewService.subscribe((newSettings) => { this.viewSettingsChanged(newSettings) });
    this.viewSettingsChanged({
      mode: this.viewService.getMode(),
      siteSettings: this.viewService.getCurrentViewFeatures()
    });

    fromEvent(window, 'SideBarChanged').subscribe(result => this.broadcastSidebarExpandedState());
    fromEvent(window, '$destroy').subscribe(result => this.cleanUp());

    // this.$rootScope.$on('SideBarChanged', () => { this.broadcastSidebarExpandedState() });
    // this.$rootScope.$on('$destroy', () => {
    //   this.cleanUp();
    // });
  }

  viewSettingsChanged(newSettings) {
    if (!newSettings) return;

    const pageSelector = 'body,html';

    switch (newSettings.mode) {
      case Views.Pod:
        this.updateElement(pageSelector, 'embeddedView fullView', true, 0);
        this.updateElement(pageSelector, 'podView', false, 0);
        break;
      case Views.Embedded:
        this.updateElement(pageSelector, 'podView fullView', true, 0);
        this.updateElement(pageSelector, 'embeddedView', false, 0);
        break;
      default:
        this.updateElement(pageSelector, 'podView embeddedView', true, 0);
        this.updateElement(pageSelector, 'fullView', false, 0);
    }

    const viewFeatures = newSettings.siteSettings;
    const viewportSelector = 'body';

    this.updateElement(viewportSelector, 'viewportNoMenu', viewFeatures.leftMenu, 0);
    this.updateElement(viewportSelector, 'viewportFixedWidth', viewFeatures.dynamicWidth, 0);


  }

  updateElement(selector, className, removeStyle, delayed) {
    const styleFunc = removeStyle ? 'remove' : 'add';
    if (selector && className) {
      const item = document.querySelector(selector);
      if (!delayed || item.length > 0) {
        if(className.indexOf(" ")>-1){
          var classList = className.split(" ");
          classList.forEach(c => {
            item.classList[styleFunc](c);
          });
        }else{
          item.classList[styleFunc](className);
        }
      } else {
        setTimeout(() => {
          this.updateElement(selector, className, removeStyle, delayed);
        }, 5);
      }
    }
  }

  cleanUp() {
    this.unsubscribeToResolutionChange(this.checkSidebarExpanded);
    this.viewService.unsubscribe(this.viewSettingsChanged);
  }

  hideOverlays() {
    this.hideFilter();
    this.hideAttributePicker();
    this.hideHierarchyPicker();
  }

  hideFilter() {
    this.notifySubscribers(EventNames.showFilter, false);
  }

  showFilter() {
    this.notifySubscribers(EventNames.showFilter, true);

  }

  showScriptedResponses() {
    this.notifySubscribers(EventNames.showScriptedResponses, true);
  }

  hideScriptedResponses() {
    this.notifySubscribers(EventNames.showScriptedResponses, false);
  }

  showRawEmailContent(caseKey, emailMessageKey) {
    this.notifySubscribers(EventNames.showRawEmailContent,
      { show: true, caseKey: caseKey, emailMessageKey: emailMessageKey });
  }

  hideRawEmailContent() {
    this.notifySubscribers(EventNames.showRawEmailContent, { show: false, caseKey: null, emailMessageKey: null });
  }

  showAttributePicker() { this.notifySubscribers(EventNames.showAttributePicker, true); }
  hideAttributePicker() { this.notifySubscribers(EventNames.showAttributePicker, false); }

  showHierarchyPicker() { this.notifySubscribers(EventNames.showHierarchyPicker, true); }
  hideHierarchyPicker() { this.notifySubscribers(EventNames.showHierarchyPicker, false); }

  isSidebarToggled() {
    const viewport =
      document.querySelector('.viewport-wrapper');
    if (viewport.classList.contains("toggled")) {
      return false;

    } else {
      return true;
    }
  }

  // Returns current state
  checkSidebarExpanded() {
    const toggled = document.querySelector('.viewport-wrapper').classList.contains("toggled");
    if (this.isMobile() || this.isPhablet() || this.isTablet()) {
      if (toggled) {
        return true;
      } else {
        return false;
      }

    } else {
      if (toggled) {
        return false;
      } else {
        return true;
      }
    }
  }

  // Broadcasts state only if state is different than prior state
  broadcastSidebarExpandedState() {
    const isExpanded = this.checkSidebarExpanded();
    if (this.isSideBarExpanded === undefined || this.isSideBarExpanded != isExpanded) {
      this.isSideBarExpanded = isExpanded;
      //this.$rootScope.$broadcast("SideBarToggled", { isExpanded: isExpanded });
      var event = new CustomEvent("SideBarToggled", { detail: { isExpanded: isExpanded } });
      document.dispatchEvent(event);
    }
  }


  toggleSidebar() {
    const viewport = document.querySelector('.viewport-wrapper');

    if (viewport.classList.contains("toggled")) {
      viewport.classList.remove("toggled");
      //this.$rootScope.$broadcast("SideBarChanged");
      var event = new CustomEvent("SideBarChanged", {});
      document.dispatchEvent(event);
      return true;

    } else {
      viewport.classList.add("toggled");
      //this.$rootScope.$broadcast("SideBarChanged");
      var event = new CustomEvent("SideBarChanged", {});
      document.dispatchEvent(event);
      return false;
    }
  }

  isMobileOrPhablet() {
    return this.isMobile() || this.isPhablet();
  }

  isMobile() {
    const device = this.resolutionService.Get();
    return device === Resolutions.Mobile;
  }

  isPhablet() {
    const device = this.resolutionService.Get();
    return device === Resolutions.Phablet;
  }

  isTablet() {
    const device = this.resolutionService.Get();
    return device === Resolutions.Tablet;
  }

  isDesktop() {
    const device = this.resolutionService.Get();
    return device === Resolutions.Desktop;
  }

  isXLDesktop() {
    const device = this.resolutionService.Get();
    return device === Resolutions.LargeDesktop;
  }

  checkForResolutionChangeTransition() {
    const currentResolution = this.resolutionService.Get();
    if (currentResolution != this.resolution) {
      this.resolution = currentResolution;
      this.processSubscribers();
    }
  }

  processSubscribers() {
    for (let activeCallbackIndex in this.activeResolutionChangeCallbacks) {
      this.activeResolutionChangeCallbacks[activeCallbackIndex]();
    }
  }

  subscribeToResolutionChange(callback: Function) {
    if (!callback) {
      return;
    }

    this.activeResolutionChangeCallbacks.push(callback);
  }

  unsubscribeToResolutionChange(callback: Function) {
    if (!callback) {
      return;
    }

    const callbackIndex = this.activeResolutionChangeCallbacks.indexOf(callback);

    if (callbackIndex >= 0) {
      this.activeResolutionChangeCallbacks.splice(callbackIndex, callbackIndex + 1);
    }
  }

  subscribeToViewportChanges(callback: Function) {
    if (!callback) {
      return;
    }

    this.viewportSubscribers.push(callback);
  }

  unsubscribeToViewportChanges(callback: Function) {
    if (!callback) {
      return;
    }

    const callbackIndex = this.viewportSubscribers.indexOf(callback);

    if (callbackIndex >= 0) {
      this.viewportSubscribers.splice(callbackIndex, callbackIndex + 1);
    }
  }

  notifySubscribers(name, data) {
    this.viewportSubscribers.forEach(function (callback) {
      callback({
        eventName: name, value: data
      });
    });
  }

  // toggleCardSettings(cardConfiguration) {
  //   if (this.$rootScope.cardConfiguration != null) {
  //     this.$rootScope.cardConfiguration = null;
  //   }
  //   else {
  //     this.$rootScope.cardConfiguration = cardConfiguration;
  //   }
  // }

}
