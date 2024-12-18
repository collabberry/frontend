import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";

export type UserState = {
  id: string;
  profilePicture?: string;
  userName?: string;
  email?: string;
  authority?: string[];
  isAdmin?: boolean;
};

const initialState: UserState = {
  profilePicture: "",
  id: "",
  userName: "",
  email: "",
  authority: [],
  isAdmin: false,
};

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    resetUser(state) {
      state.profilePicture = initialState.profilePicture;
      state.email = initialState.email;
      state.userName = initialState.userName;
      state.authority = initialState.authority;
      state.id = initialState.id;
      state.isAdmin = initialState.isAdmin;
    },
    setUser(state, action: PayloadAction<UserState>) {
      state.profilePicture = action.payload?.profilePicture;
      state.email = action.payload?.email;
      state.userName = action.payload?.userName;
      state.authority = action.payload?.authority;
      state.id = action.payload?.id;
      state.isAdmin = action.payload?.isAdmin;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
