import { environment } from "@/api/environment";

export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  inviteEntryPath: string;
  notRegisteredEntryPath: string;
  memberSignUpPath: string;
  tourPath: string;
  locale: string;
  enableMock: boolean;
};

const appConfig: AppConfig = {
  apiPrefix: `${environment.apiUrl}/api`,
  authenticatedEntryPath: "/dashboard",
  unAuthenticatedEntryPath: "/sign-in",
  notRegisteredEntryPath: "/sign-up",
  inviteEntryPath: "/invite",
  memberSignUpPath: "/member-sign-up",
  tourPath: "/",
  locale: "en",
  enableMock: true,
};

export default appConfig;
