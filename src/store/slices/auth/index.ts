import { combineReducers } from '@reduxjs/toolkit'
import session, { SessionState } from './sessionSlice'
import user, { UserState } from './userSlice'
import org, { OrgState } from './orgSlice'
import agreement, { AgreementState } from './agreementSlice'
import invite, { InvitationTokenState } from './inviteLinkSlice'

const reducer = combineReducers({
    session,
    user,
    org,
    agreement,
    invite
})

export type AuthState = {
    session: SessionState
    user: UserState,
    org: OrgState
    agreement: AgreementState
    invite: InvitationTokenState
}

export * from './sessionSlice'
export * from './userSlice'
export * from './orgSlice'
export * from './agreementSlice'
export * from './inviteLinkSlice'

export default reducer
