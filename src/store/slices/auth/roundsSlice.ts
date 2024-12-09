import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { Contributor } from "@/models/Organization.model";
import { add } from "lodash";
import { setActiveLink } from "react-scroll/modules/mixins/scroller";

export type RoundsState = {
  currentRound: any;
  allRounds: any[];
  selectedRound: any;
  selectedUser: any | null;
};

const initialState: RoundsState = {
  currentRound: null,
  allRounds: [],
  selectedRound: null,
  selectedUser: null,
};

const roundsSlice = createSlice({
  name: `${SLICE_BASE_NAME}/rounds`,
  initialState,
  reducers: {
    resetRoundsState(state) {
      state.currentRound = null;
      state.allRounds = [];
      state.selectedRound = null;
      state.selectedUser = null;
    },
    setRounds(state, action: PayloadAction<any>) {
      state.currentRound = action.payload;
    },
    setSelectedUser(state, action: PayloadAction<Contributor>) {
      state.selectedUser = action.payload;
    },
    setAllRounds(state, action: PayloadAction<any>) {
      state.allRounds = action.payload;
    },
    setSelectedRound(state, action: PayloadAction<any>) {
      state.selectedRound = action.payload;
    },

  },
});

export const { setRounds, resetRoundsState , setAllRounds, setSelectedRound, setSelectedUser} = roundsSlice.actions;
export const getSubmittedAssessments = (state: RoundsState) =>
  state.currentRound?.submittedAssessments || [];
export default roundsSlice.reducer;
