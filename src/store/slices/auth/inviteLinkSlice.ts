import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";

export type InvitationTokenState = {
  invitationToken: string;
};

const initialState: InvitationTokenState = {
  invitationToken: "",
};

const inviteLinkSilce = createSlice({
  name: `${SLICE_BASE_NAME}/invite`,
  initialState,
  reducers: {
    resetInvitationToken(state) {
      state.invitationToken = "";
    },
    setInvitationToken(state, action: PayloadAction<InvitationTokenState>) {
      state.invitationToken = action.payload?.invitationToken;
    },
  },
});

export const { setInvitationToken, resetInvitationToken } = inviteLinkSilce.actions;
export const getInvitationToken = (state: { invite: InvitationTokenState }) =>
  state.invite;
export default inviteLinkSilce.reducer;
