export interface AuthSettings {
    apiBaseUri: string;
    clientId: string;
    tokenEndpoint: string;
    loginEndpoint: string;
    endSessionEndpoint: string;
    smg360Client: string;
    smg360Scope: string;
  }
  
  export interface TimeoutSettings {
    smg360Timeout: string;
    accessTokenTimeout: string;
    cacheTimeout: string;
  }
  
  export interface AppActivity {
    url: string;
    appName: string;
    appId: string;
    appKey: string;
  }
  
  export type Features = { [key: string]: string } & {
  
  };
  
  export type DefaultValues = { [key: string]: string } & {
  
  };
  
  export interface Settings {
    authSettings: AuthSettings;
    timeoutSettings: TimeoutSettings;
    features: Features;
    classicReportUrl: string;
    classicReportDefaultUrl: string;
    showTaSentimentCorrection: string;
    showMultipleCommentReports: string;
    showReprocessing: string;
    maxAuthRetries: string;
    googleAnalyticsTrackingId: string;
    maxRequestLength: string;
    enableDashboards: string;
    enableDashboardSentimentAndMeasures: string;
    aiNativeBetaAccounts: string;
    enableRtlLanguages: string;
    enableCategoryFilter: string;
    appActivity: AppActivity;
    etrack: Etrack;
    defaultValues: DefaultValues;
  }
  
  export interface Etrack {
    url: string;
    supportedCardTypes: string;
    subscriptionId: string;
    environment: string;
  }
  
  export interface AppSettings {
    local: Settings;
    release: Settings;
  }
  