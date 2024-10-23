import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { Contributor } from "@/models/Organization.model";
import { add } from "lodash";
import { setActiveLink } from "react-scroll/modules/mixins/scroller";

export type RoundsState = {
  currentRound: any;
  allRounds: any[];
  selectedRound: any;
};

const initialState: RoundsState = {
  currentRound: null,
  allRounds: [],
  selectedRound: null,
};

const roundsSlice = createSlice({
  name: `${SLICE_BASE_NAME}/rounds`,
  initialState,
  reducers: {
    resetRoundsState(state) {
      state.currentRound = null;
      state.allRounds = [];
      state.selectedRound = null;
    },
    setRounds(state, action: PayloadAction<any>) {
      state.currentRound = action.payload;
    },
    setAllRounds(state, action: PayloadAction<any>) {
      state.allRounds = action.payload;
    },
    setSelectedRound(state, action: PayloadAction<any>) {
      state.selectedRound = action.payload;
    },

  },
});

export const { setRounds, resetRoundsState , setAllRounds, setSelectedRound} = roundsSlice.actions;
export const getSubmittedAssessments = (state: RoundsState) =>
  state.currentRound?.submittedAssessments || [];
export default roundsSlice.reducer;
