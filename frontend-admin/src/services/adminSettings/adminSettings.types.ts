export interface IAdminSettings {
  _id: string;
  appName: string;
  frontendUrl: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  backgroundColor: string;
  sidebarColor: string;
  fontFamily: string;
}

export interface AdminSettingsPayload {
  appName: string;
  frontendUrl: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  backgroundColor: string;
  sidebarColor: string;
  fontFamily: string;
}
