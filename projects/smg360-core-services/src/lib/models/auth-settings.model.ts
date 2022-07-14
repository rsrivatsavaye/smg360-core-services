export interface IAuthSettings {
  apiBaseUri: string | null;
  clientId: string | null;
  tokenEndpoint: string | null;
  loginEndpoint: string | null;
  endSessionEndpoint: string | null;
  smg360Client: string | null;
  smg360Scope: string | null;
}

export const AuthSettings: IAuthSettings = {
  apiBaseUri: null,
  clientId: null,
  tokenEndpoint: null,
  loginEndpoint: null,
  endSessionEndpoint: null,
  smg360Client: null,
  smg360Scope: null
};
