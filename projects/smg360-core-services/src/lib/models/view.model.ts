import { Views } from '../enums/views.enum';

export interface BaseSiteSettings {
  fullCardView: boolean;
  commentInfiniteScroll: boolean;
  commentTAPods: boolean;
  commentHeader: boolean;
  interactiveDetails: boolean;
  showFooter: boolean;
  redirectToClassicReportingSite: boolean;
  commentSubtitle: boolean;
  search: boolean;
  commentPadding: boolean;
  dashboard: boolean;
  topMenu: boolean;
  configButton: boolean;
  banner: boolean;
  commentAggregate: boolean;
  sort: boolean;
  commentFilter: boolean;
  commentFilterClose: boolean;
  breadcrumb: boolean;
  dynamicWidth: boolean;
  commentTitle: boolean;
  timeoutDialog: boolean;
  facetBar: boolean;
}

export interface WithoutSideMenu {
  leftMenu: false;
  // prevents this field from being specified when leftMenu is false
  leftMenuLinks?: never;
}

export interface WithSideMenu {
  leftMenu: true;
  // requires this field when leftMenu is true
  leftMenuLinks: SideMenuLinks;
}

export interface SideMenuLinks {
  feedback: boolean;
  V5Link: boolean;
  logOut: boolean;
  dashboard: boolean;
  commentReport: boolean;
}

// Final combined type requires all fields except for leftMenuLinks which is only required when leftMenu is set to true
export type SiteSettings = BaseSiteSettings & (WithoutSideMenu | WithSideMenu);

export interface ViewModeContext {
  mode?: Views;
  siteSettings?: SiteSettings;
}
