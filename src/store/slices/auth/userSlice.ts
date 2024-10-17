import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { placeholderAvatars } from "@/components/collabberry/helpers/Avatars";

export type UserState = {
  id: string;
  profilePicture?: string;
  userName?: string;
  email?: string;
  authority?: string[];
};


const initialState: UserState = {
  profilePicture: "",
  id: "",
  userName: "",
  email: "",
  authority: [],
};

const userSlice = createSlice({
  name: `${SLICE_BASE_NAME}/user`,
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.profilePicture = action.payload?.profilePicture;
      state.email = action.payload?.email;
      state.userName = action.payload?.userName;
      state.authority = action.payload?.authority;
      state.id = action.payload?.id;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
