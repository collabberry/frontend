import { combineReducers } from "@reduxjs/toolkit";
import session, { SessionState } from "./sessionSlice";
import user, { UserState } from "./userSlice";
import org, { OrgState } from "./orgSlice";
import admin, { AdminState } from "./adminsSlice";

import agreement, { AgreementState } from "./agreementSlice";
import invite, { InvitationTokenState } from "./inviteLinkSlice";
import assessment, { AssessmentState } from "./assessmentSlice";
import rounds, { RoundsState } from "./roundsSlice";
import contributor, { ContributorState } from "./contributorSlice";

const reducer = combineReducers({
  session,
  user,
  org,
  admin,
  agreement,
  invite,
  assessment,
  rounds,
  contributor
});

export type AuthState = {
  session: SessionState;
  user: UserState;
  org: OrgState;
  admin: AdminState;
  agreement: AgreementState;
  invite: InvitationTokenState;
  assessment: AssessmentState;
  rounds: RoundsState;
  contributor: ContributorState;
};

export * from "./sessionSlice";
export * from "./userSlice";
export * from "./orgSlice";
export * from "./adminsSlice"
export * from "./agreementSlice";
export * from "./inviteLinkSlice";
export * from "./assessmentSlice";
export * from "./roundsSlice";
export * from "./contributorSlice";

export default reducer;
