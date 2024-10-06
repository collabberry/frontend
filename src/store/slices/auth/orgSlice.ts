import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { Contributor } from '@/models/Organization.model'

export type OrgState = {
    logo?: string
    name?: string
    id?: string
    par?: string
    cycle?: string
    startDate?: string
    contributors?: Contributor[]
}

const initialState: OrgState = {
    logo: '',
    name: '',
    id: '',
    par: '',
    cycle: '',
    startDate: '',
    contributors: [],
}

const orgSlice = createSlice({
    name: `${SLICE_BASE_NAME}/org`,
    initialState,
    reducers: {
        setOrganization(state, action: PayloadAction<OrgState>) {
            state.logo = action.payload?.logo
            state.name = action.payload?.name
            state.id = action.payload?.id
            state.par = action.payload?.par
            state.cycle = action.payload?.cycle
            state.startDate = action.payload?.startDate
            state.contributors =  action.payload?.contributors || []
        },
    },
})

export const { setOrganization } = orgSlice.actions
export const getOrganization = (state: { org: OrgState }) => state.org
export default orgSlice.reducer
