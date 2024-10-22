import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { Contributor } from "@/models/Organization.model";
import { add } from "lodash";

export type RoundsState = {
  currentRound: any;
};

const initialState: RoundsState = {
  currentRound: null,
};

const roundsSlice = createSlice({
  name: `${SLICE_BASE_NAME}/rounds`,
  initialState,
  reducers: {
    resetRoundsState(state) {
      state.currentRound = null;
    },
    setRounds(state, action: PayloadAction<any>) {
      state.currentRound = action.payload.currentRound;
    },
  },
});

export const { setRounds, resetRoundsState } = roundsSlice.actions;
export const getSubmittedAssessments = (state: RoundsState) =>
  state.currentRound?.submittedAssessments || [];
export default roundsSlice.reducer;
