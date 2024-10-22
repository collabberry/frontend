export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  notRegisteredEntryPath: string;
  tourPath: string;
  locale: string;
  enableMock: boolean;
};

const appConfig: AppConfig = {
  apiPrefix: `${import.meta.env.VITE_APP_BASE_URL}/api`,
  authenticatedEntryPath: "/dashboard",
  unAuthenticatedEntryPath: "/sign-in",
  notRegisteredEntryPath: "/sign-up",
  tourPath: "/",
  locale: "en",
  enableMock: true,
};

export default appConfig;
