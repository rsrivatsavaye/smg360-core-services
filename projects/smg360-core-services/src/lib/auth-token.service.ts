import { Injectable } from '@angular/core';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  constructor(private locationService:LocationService) { }
  getAccessToken() {
    var currentHash = this.locationService.hash;
    if (!currentHash) {
        return null;
    }
    var token_name = "access_token";
    var id_token_name = "id_token";

    const siteUrl = currentHash.replace("/", "").replace("#", "").replace('%23', "&");
    var vars;
    if (siteUrl.indexOf(token_name) !== -1) {
        vars = siteUrl.split("&").join(',').split("?").join(',').split("#").join(',').split(",");
    } else {
        vars = [];
    }

    const key = {};
    for (let i = 0; i < vars.length; i++) {
        const tmp = vars[i].split("=");
        key[tmp[0]] = tmp[1];
    }
    const accessToken =  key[token_name];

    if (accessToken) {
        var refreshToken = key["refresh_token"];
        const id_token = key[id_token_name];
        const client = this.getAuthClient(accessToken);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            idToken: id_token,
            client: client
    };
    }

    return null;
}

getAuthClient(access_Token):string {
    var token = JSON.parse(window.atob(access_Token.split('.')[1]));
    return token.client_id;
}
}
