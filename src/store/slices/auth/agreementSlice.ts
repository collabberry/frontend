import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";

export type AgreementState = {
  marketRate: number;
  roleName: string;
  responsibilities: string;
  fiatRequested: number;
  commitment: number;
};

const initialState: AgreementState = {
  marketRate: 0,
  roleName: "",
  responsibilities: "",
  fiatRequested: 0,
  commitment: 0,
};

const agreementSlice = createSlice({
  name: `${SLICE_BASE_NAME}/agreement`,
  initialState,
  reducers: {
    resetAgreement(state) {
      state.marketRate = initialState.marketRate;
      state.roleName = initialState.roleName;
      state.responsibilities = initialState.responsibilities;
      state.fiatRequested = initialState.fiatRequested;
      state.commitment = initialState.commitment;
    },
    setAgreement(state, action: PayloadAction<AgreementState>) {
      state.marketRate = action.payload?.marketRate;
      state.roleName = action.payload?.roleName;
      state.responsibilities = action.payload?.responsibilities;
      state.fiatRequested = action.payload?.fiatRequested;
      state.commitment = action.payload?.commitment;
    },
  },
});

export const { setAgreement, resetAgreement } = agreementSlice.actions;
export const getAgreement = (state: { agreement: AgreementState }) =>
  state.agreement;
export default agreementSlice.reducer;
