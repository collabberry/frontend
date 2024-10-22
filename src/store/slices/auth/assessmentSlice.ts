import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { Contributor } from "@/models/Organization.model";
import { set } from "lodash";

export type AssessmentState = {
  teamMembers: Contributor[];
  reviewedMembers: string[];
};

const initialState: AssessmentState = {
  teamMembers: [],
  reviewedMembers: [],
};

const assessmentSlice = createSlice({
  name: `${SLICE_BASE_NAME}/assessment`,
  initialState,
  reducers: {
    resetAssessmentState(state) {
      state.teamMembers = [];
    },
    setSelectedTeamMembers(state, action: PayloadAction<Contributor>) {
      state.teamMembers = [...(action.payload as unknown as Contributor[])];
    },
    addReviewedMember(state, action: PayloadAction<string>) {
      state.reviewedMembers.push(action.payload);
    },
    setReviewedMembers(state, action: PayloadAction<string[]>) {
      state.reviewedMembers = [...action.payload];
    },
  },
});

export const {
  setSelectedTeamMembers,
  resetAssessmentState,
  addReviewedMember,
  setReviewedMembers,
} = assessmentSlice.actions;
export default assessmentSlice.reducer;
