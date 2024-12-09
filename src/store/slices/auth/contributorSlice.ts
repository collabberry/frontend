import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";

export type ContributorState = {
  selectedContributor: any;
  contributorAssessments: any[];
};

const initialState: ContributorState = {
  selectedContributor: null,
  contributorAssessments: [],
};

const contributorSlice = createSlice({
  name: `${SLICE_BASE_NAME}/contributor`,
  initialState,
  reducers: {
    resetContributorState(state) {
      state.selectedContributor = null;
      state.contributorAssessments = [];
    },
    setSelectedContributor(state, action: PayloadAction<any>) {
      state.selectedContributor = action.payload;
    },
    setContributorAssessments(state, action: PayloadAction<any>) {
      state.contributorAssessments = action.payload;
    },
  },
});

export const {
  setContributorAssessments,
  setSelectedContributor,
  resetContributorState,
} = contributorSlice.actions;
export const getContributorAssessments = (state: ContributorState) =>
  state.contributorAssessments || [];
export default contributorSlice.reducer;
