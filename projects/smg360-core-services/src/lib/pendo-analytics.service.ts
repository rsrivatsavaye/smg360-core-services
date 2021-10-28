import { Injectable, NgZone } from '@angular/core';
declare const pendo: any;
export class Analytics {
  userId: string;
  accountId: string;
  accountName: string;
  groupId: string;
  groupName: string;
  accountStatus: boolean;
  accountType: number;
}
/**
 * Proof of Technology
 * this service (Pendo) is being tested as a possible replacement/enhancement for Google Analytics
 * If this becomes standard we need to move this service to the core services library.
 *
 * @usages Reporting
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class PendoAnalyticsService {
  previous: Analytics;
  page: string;
  constructor(private _ngZone: NgZone) {}
  /**
   * looks for changes to user/account and calls Pendo init when necessary
   */
  init(dimensions: Analytics) {
    this._ngZone.runOutsideAngular(() => {
      if (
        this.previous &&
        dimensions &&
        this.previous.userId === dimensions.userId &&
        this.previous.accountId === dimensions.accountId &&
        this.previous.accountName === dimensions.accountName
      ) {
        return;
      } else {
        this.previous = dimensions;
        try {
          pendo.initialize({
            visitor: {
              id: dimensions.userId, // Required if user is logged in
              // email:        // Recommended if using Pendo Feedback, or NPS Email
              // full_name:    // Recommended if using Pendo Feedback
              role: dimensions.groupName, // Optional
              groupId: dimensions.groupId
              // You can add any additional visitor level key-values here,
              // as long as it's not one of the above reserved names.
            },

            account: {
              id: dimensions.accountId, // Highly recommended
              name: dimensions.accountName, // Optional
              status: dimensions.accountStatus ? 'Active' : 'InActive',
              type: dimensions.accountType === 0 ? 'Client' : 'Internal'
              // is_paying:    // Recommended if using Pendo Feedback
              // monthly_value:// Recommended if using Pendo Feedback
              // planLevel:    // Optional
              // planPrice:    // Optional
              // creationDate: // Optional

              // You can add any additional account level key-values here,
              // as long as it's not one of the above reserved names.
            },
            location: {
              transforms: [
                {
                  attr: 'search',
                  action: 'AddTo',
                  data: () => {
                    return { page: this.page };
                  }
                }
              ]
            }
          });
        } catch (error) {
          console.log('Pendo threw an execption', error);
        }
      }
    });
  }
}
