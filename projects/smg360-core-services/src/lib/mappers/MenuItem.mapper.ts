import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../public-api';
import { MenuItem } from '../models/menu-items.model';
import { ViewService } from '../view.service';
import * as analyticsMetadataObjects from '../contstants/analytics-metadata.constants'

export class MenuItemMapper {

    static map(items: Array<MenuItem>, viewService: ViewService, localStorageService: LocalStorageService,translationService:TranslateService): Array<MenuItem> {
      var settings = viewService.getCurrentViewFeatures();
      var returnItems = [];
      returnItems = items.filter(r => this.settingsFilter(r, settings)).map(r => {
        r.menuUrl = decodeURIComponent(r.menuUrl);
        this.populateTextKey(r,translationService);
        return r;
      });
   
      /*
       * [AV-43/PBI 175770]
       * This has been added to allow for the reauthentication of an expired v5 user when
       * navigating back to v5 without the need to log in manually
      */
      var links = returnItems.filter(m => m.menuTextTranslationKey === "MENU_NAV_V5_LINK");
      if (links && links.length === 1) {
        const authorization: any = localStorageService.getObjectItem('ls.authorizationData');
        var userName = "";
        var accessToken = authorization.token;
        var token = JSON.parse(window.atob(accessToken.split('.')[1]));
        userName = token.name;
        links[0].menuUrl = links[0].menuUrl + "?token=" + accessToken + "&username=" + userName;
      }
  
      this.assignAnalyticsMetadataObjects(returnItems);
      return returnItems;
    }
  
    static populateTextKey(item:MenuItem,translationService:TranslateService){
      item.menuText = translationService.instant(item.menuTextTranslationKey);
      if(item.menuItems){
        item.menuItems.forEach(i=>this.populateTextKey(i,translationService));
      }
    }
  
    static settingsFilter(menuItem, settings) {
  
      if (menuItem.menuTextTranslationKey === "DASHBOARDS" && !settings.showDashboardLink) { return false; }
      if (menuItem.menuTextTranslationKey === "COMMENT_REPORT" && !settings.showCommentReportLink) { return false; }
      if (menuItem.menuTextTranslationKey === "V5_LINK" && !settings.showV5Link) { return false; }
      if (menuItem.menuTextTranslationKey === "FEEDBACK" && !settings.showFeedbackLink) { return false; }
      if (menuItem.menuTextTranslationKey === "LOGOUT" && !settings.showLogOutLink) { return false; }
      return true;
    }
    static assignAnalyticsMetadataObjects(items) {
      items.forEach(item => {
        if (item.menuTextTranslationKey === "MENU_NAV_DASHBOARDS") { item.analyticsMetadataObject = this.createAnalyticsObject(analyticsMetadataObjects.labels.filterPanelLabels.navigation.dashboards); }
        if (item.menuTextTranslationKey === "MENU_NAV_REPORTS") { item.analyticsMetadataObject = this.createAnalyticsObject(analyticsMetadataObjects.labels.filterPanelLabels.navigation.reports) }
        if (item.menuTextTranslationKey === "MENU_NAV_V5_LINK") { item.analyticsMetadataObject = this.createAnalyticsObject(analyticsMetadataObjects.labels.filterPanelLabels.navigation.previousReportingSite); }
        if (item.menuTextTranslationKey === "MENU_NAV_FEEDBACK") { item.analyticsMetadataObject = this.createAnalyticsObject(analyticsMetadataObjects.labels.filterPanelLabels.navigation.feedback); }
        if (item.menuTextTranslationKey === "MENU_NAV_LOGOUT") { item.analyticsMetadataObject = this.createAnalyticsObject(analyticsMetadataObjects.labels.filterPanelLabels.navigation.logout); }
      });
    }
  
    static createAnalyticsObject(label) {
      return {
        action: analyticsMetadataObjects.actions.filterPanelActions.selectNavigation,
        metadata: { category: analyticsMetadataObjects.categories.filterPanel, label: label }
      };
  
    }
  }
  