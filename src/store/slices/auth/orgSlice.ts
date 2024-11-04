import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { Contributor } from "@/models/Organization.model";

export type OrgState = {
  id?: string;
  par?: number;
  startDate?: string;
  cycle?: number;
  name: string;
  logo?: string;
  nextRoundDate?: string;
  roundsActivated?: boolean;
  contributors?: Contributor[];
};

const initialState: OrgState = {
  logo: "",
  name: "",
  id: "",
  par: undefined,
  cycle: undefined,
  startDate: "",
  nextRoundDate: "",
  contributors: [],
  roundsActivated: false,
};

const orgSlice = createSlice({
  name: `${SLICE_BASE_NAME}/org`,
  initialState,
  reducers: {
    resetOrganization(state) {
      state.logo = initialState.logo;
      state.name = initialState.name;
      state.id = initialState.id;
      state.par = initialState.par;
      state.cycle = initialState.cycle;
      state.startDate = initialState.startDate;
      state.nextRoundDate = initialState.nextRoundDate;
      state.contributors = initialState.contributors;
      state.roundsActivated = initialState.roundsActivated;
    },
    setOrganization(state, action: PayloadAction<OrgState>) {
      state.logo = action.payload?.logo;
      state.name = action.payload?.name;
      state.id = action.payload?.id;
      state.par = action.payload?.par;
      state.cycle = action.payload?.cycle;
      state.startDate = action.payload?.startDate;
      state.nextRoundDate = action.payload?.nextRoundDate;
      state.contributors = action.payload?.contributors || [];
      state.roundsActivated = action.payload?.roundsActivated;
    },
  },
});

export const { setOrganization, resetOrganization } = orgSlice.actions;
export const getOrganization = (state: { org: OrgState }) => state.org;
export default orgSlice.reducer;
