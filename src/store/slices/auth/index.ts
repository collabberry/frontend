import { combineReducers } from '@reduxjs/toolkit'
import session, { SessionState } from './sessionSlice'
import user, { UserState } from './userSlice'
import org, { OrgState } from './orgSlice'
import agreement, { AgreementState } from './agreementSlice'

const reducer = combineReducers({
    session,
    user,
    org,
    agreement
})

export type AuthState = {
    session: SessionState
    user: UserState,
    org: OrgState
    agreement: AgreementState
}

export * from './sessionSlice'
export * from './userSlice'
export * from './orgSlice'
export * from './agreementSlice'


export default reducer
