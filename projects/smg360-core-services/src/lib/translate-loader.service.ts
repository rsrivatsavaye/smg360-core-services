import { Injectable } from '@angular/core';
import {PartialTranslateLoaderService} from './partial-translate-loader.service';
import { TranslateService } from '@ngx-translate/core'


@Injectable({
  providedIn: 'root'
})
export class TranslateLoaderService {
  urlBase = '/api/text/bundle';
  constructor(private partialTranslation:PartialTranslateLoaderService, private translate:TranslateService) {
 
   }
       /**
     * Load the internationalization data for an account.
     *
     * @param accountAlias The alias ID of the account for which internationalization resources are to be loaded.
     */
    loadAccountTemplate(accountId:string) {
      //this.$translatePartialLoader.addPart(this.buildReportingBundlePart(accountId));
      return this.partialTranslation.addPart(this.buildReportingBundlePart(accountId));
      
  }
      /**
     * Loads the internationalization resource for the admin functionality
     */
    loadAdminTemplate(accountId?:string) {
      return  this.partialTranslation.addPart(this.buildAdminBundlePart(accountId));
  }

  /**
     * Loads the internationalization dynamically into the translation service.
     * @param accountId The ID of the account for which internationalization resources are to be loaded.
     * @return A Promise that can be used to handle the success or failure of the refreshing of the translation keys.
     */
    loadDynamicAccountTemplate(accountId) {
      this.translate.resetLang(this.partialTranslation.language);
      return this.loadAdminTemplate(accountId);
      // var deferred = this.$q.defer();

      // if (this.checkMatchingParts(this.buildAdminBundlePart(accountId))) {
      //     deferred.resolve();
      // } else {
      //     this.loadAdminTemplate(accountId);
      //     this.$translate.refresh().then( ()=> {
      //         deferred.resolve();
      //     },  (error)=> {
      //         deferred.reject(error);
      //     });
      // }

      // return deferred.promise;
  }

      /**
     * Unloads the internationalization for a given account.
     * @param accountId The ID of the account for which internationalization resources are to be loaded.
     * @return A Promise that can be used to handle the success or failure of the refreshing of the translation keys.
     */
    unloadDynamicAccountTemplate(accountId:string) {
      this.translate.resetLang(this.partialTranslation.language);
      // var deferred = this.$q.defer();

      // if (this.removeMatchingParts(this.buildAdminBundlePart(accountId))) {
      //     this.$translate.refresh().then( ()=> {
      //         deferred.resolve();
      //     }).catch( (error)=> {
      //         deferred.reject(error);
      //     });
      // } else {
      //     deferred.resolve();
      // }

      // return deferred.promise;
  }

      /**
     * Build the part to load the reporting bundle
     */
    buildReportingBundlePart(accountId:string) {
      return this.urlBase + '/SMG360' + this.getAccount(accountId);
  }
  
    /**
     * Build the part to load the admin bundle
     */
    buildAdminBundlePart(accountId:string) {
      return this.urlBase + '/SMG360Admin' + this.getAccount(accountId);
  }
  
    /**
     * Adds the accountId
     */
    getAccount(accountId:string) {
      return (accountId ? '?accountId=' + accountId : '');
  }
}


