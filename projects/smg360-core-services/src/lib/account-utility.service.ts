import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AccountUtilityService {
  public selectedAccount: Account;
  constructor() {

  }
  getSelectedAccount() {
    return this.selectedAccount;
  }
  setSelectedAccount(account) {
    this.selectedAccount = account;
    if (account.expirationDate && account.expirationDate < moment().add(1, "days").format()) {
      window.location.href = "/account-expired.html";
    }
  }
}
