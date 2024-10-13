import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";
import { placeholderAvatars } from "@/components/collabberry/helpers/Avatars";

export type UserState = {
  id: string;
  avatar?: string;
  userName?: string;
  email?: string;
  authority?: string[];
};


const initialState: UserState = {
  avatar: "",
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
      state.avatar = action.payload?.avatar;
      state.email = action.payload?.email;
      state.userName = action.payload?.userName;
      state.authority = action.payload?.authority;
      state.id = action.payload?.id;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
