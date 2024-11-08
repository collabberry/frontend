import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { Contributor } from "@/models/Organization.model";

export type OrgState = {
  id?: string;
  par?: number;
  compensationStartDay?: string;
  assessmentStartDelayInDays?: number;
  assessmentDurationInDays?: number;
  compensationPeriod?: number;
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
  compensationPeriod: undefined,
  compensationStartDay: "",
  assessmentStartDelayInDays: undefined,
  assessmentDurationInDays: undefined,
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
      state.compensationPeriod = initialState.compensationPeriod;
      state.compensationStartDay = initialState.compensationStartDay;
      state.assessmentStartDelayInDays = initialState.assessmentStartDelayInDays;
      state.assessmentDurationInDays = initialState.assessmentDurationInDays;
      state.nextRoundDate = initialState.nextRoundDate;
      state.contributors = initialState.contributors;
      state.roundsActivated = initialState.roundsActivated;
    },
    setOrganization(state, action: PayloadAction<OrgState>) {
      state.logo = action.payload?.logo;
      state.name = action.payload?.name;
      state.id = action.payload?.id;
      state.par = action.payload?.par;
      state.compensationPeriod = action.payload?.compensationPeriod;
      state.compensationStartDay = action.payload?.compensationStartDay;
      state.assessmentStartDelayInDays = action.payload?.assessmentStartDelayInDays;
      state.assessmentDurationInDays = action.payload?.assessmentDurationInDays;
      state.nextRoundDate = action.payload?.nextRoundDate;
      state.contributors = action.payload?.contributors || [];
      state.roundsActivated = action.payload?.roundsActivated;
    },
  },
});

export const { setOrganization, resetOrganization } = orgSlice.actions;
export const getOrganization = (state: { org: OrgState }) => state.org;
export default orgSlice.reducer;
