export interface AccountLite {
  id: string;
  alias: string;
  dashboardId: string;
  commentReportId: string;
  caseAggregateReportId: string;
  caseListReportId: string;
  alertListReportId: string;
  categoryTrendReportId: string;
  expirationDate: Date;
  caseMobileAccess: boolean;
  syncUserForSocial: boolean;
  ratingsTrackMenu: boolean;
  callMinerMenu: boolean;
}
