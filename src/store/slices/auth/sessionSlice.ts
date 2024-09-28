import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export interface SessionState {
    status: "authenticated" | "unauthenticated"
    signedIn: boolean
    token: string | null
}

const initialState: SessionState = {
    status: "unauthenticated",
    signedIn: false,
    token: null,
}

const sessionSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        walletConnected(state, action: PayloadAction<string>) {
            state.status = "authenticated"
            state.token = action.payload
        },
        signInSuccess(state, action: PayloadAction<string>) {
            state.status = "authenticated"
            state.signedIn = true
            state.token = action.payload
        },
        signOutSuccess(state) {
            state.status = "unauthenticated"
            state.signedIn = false
            state.token = null
        },
    },
})

export const { signInSuccess, signOutSuccess, walletConnected } = sessionSlice.actions
export default sessionSlice.reducer
