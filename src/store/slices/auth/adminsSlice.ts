import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { Contributor } from "@/models/Organization.model";

export type AdminState = {
  admins: Contributor[];
};

const initialState: AdminState = {
    admins: [],
};

const adminSlice = createSlice({
  name: `${SLICE_BASE_NAME}/admin`,
  initialState,
  reducers: {
    resetAdmins(state) {
        state.admins = initialState.admins;
        
    },
    setAdmins(state, action: PayloadAction<AdminState>) {
        state.admins = action.payload.admins;
    },
  },
});

export const { setAdmins, resetAdmins } = adminSlice.actions;
export const getAdmins = (state: { admin: AdminState }) => state.admin.admins;
export default adminSlice.reducer;
