import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';
import { Views } from './enums/views.enum';
import { LocalStorageService } from './local-storage.service';
import { LocationService } from './location.service';
import { AuthSettings } from './models/auth-settings.model';
import { V5AuthenticationRefreshService } from './v5-authentication-refresh.service';
import { ViewService } from './view.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private viewService: ViewService,
    private v5AuthenticationRefreshService: V5AuthenticationRefreshService,
    private localStorageService:LocalStorageService,
    private locationService:LocationService,
    private http: HttpClient) { }


  auth360() {
    return `${AuthSettings.apiBaseUri}${AuthSettings.loginEndpoint}?client_id=${AuthSettings.smg360Client}&scope=${AuthSettings.smg360Scope}&response_type=token id_token code&redirect_uri=${this.locationService.origin}&nonce=xyz`;
  }

  clearClient() {
    this.localStorageService.remove("client");
    this.localStorageService.remove("authorizationData");
  }

  logOut(v5Logoutcheck?) {
    console.info("AuthenticationService - logout() called.");
    const authData:any = this.localStorageService.getObjectItem("authorizationData");

    if (v5Logoutcheck) {
      this.localStorageService.remove("authorizationData");
      this.v5Logout();
    }

    if (authData) {
      if (this.is360User()) {
        // Token Revocation can land here once it doesn't log the user out of every session.
        const token = authData.idToken;

        this.locationService.href =
          `${AuthSettings.apiBaseUri}${AuthSettings.endSessionEndpoint}?ClientId=${AuthSettings.smg360Client
          }&id_token_hint=${token}&post_logout_redirect_uri=${this.locationService.origin
          }&EnablePostSignOutAutoRedirect=true&EnableSignOutPrompt=false&RequireSignOutPrompt=false&DisableSignOutPrompt=true`;
        this.clearClient();
      }
      else {
        this.localStorageService.remove("authorizationData");
      }
    } else {
      this.v5Logout();
    }
  }

  is360User() {
    const client = this.localStorageService.getItem("client");
    return client ? client === AuthSettings.smg360Client : true;
  }

  isAuthenticationRequest(httpRequest) {
    return httpRequest && httpRequest.url && httpRequest.url.indexOf(AuthSettings.apiBaseUri + AuthSettings.tokenEndpoint) >= 0;
  }

  refreshToken(refreshV5) {
    const authData = this.localStorageService.getObjectItem("authorizationData") as any;
    if (authData) {
     return this.http.post("/api/authentication/token/refresh", authData.refresh_token).pipe(map((refreshedToken: any) => {
      this.localStorageService.remove("authorizationData");
      this.localStorageService.setObjectItem("authorizationData", {
          token: refreshedToken.accessToken,
          refresh_token: refreshedToken.refreshToken
        });

        if (refreshV5 === undefined || refreshV5) {
          this.v5AuthenticationRefreshService.refreshV5(refreshedToken.accessToken);
        }

      //  this.refreshPromise = null;
      }, catchError(error => {
        //this.logOut();
        throw new Error("Error refreshing token");
      })
      ));

    } else {
      throw new Error("Error refreshing token authData not present in local storage");
    }
  }

  v5Logout() {
    // tell v5 to logout for pod and embedded modes
    const viewServiceMode = this.viewService.getMode();
    if (viewServiceMode === Views.Pod || viewServiceMode === Views.Embedded) {
      window.top.postMessage("logout360Redirect", "*");
    }
  }

}
