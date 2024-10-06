export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    notRegisteredEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: 'http://16.171.142.20/api',
    authenticatedEntryPath: '/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    notRegisteredEntryPath: '/sign-up',
    tourPath: '/',
    locale: 'en',
    enableMock: true,
}

export default appConfig
