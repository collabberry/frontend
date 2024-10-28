import { lazy } from "react";
import type { Routes } from "@/@types/routes";

const authRoute: Routes = [
  {
    key: "signIn",
    path: `/sign-in`,
    component: lazy(() => import("@/views/auth/SignIn")),
    authority: [],
  },
  {
    key: "signUp",
    path: `/sign-up`,
    component: lazy(() => import("@/views/auth/SignUp")),
    authority: [],
  },
  {
    key: "memberSignUp",
    path: `/member-sign-up`,
    component: lazy(() => import("@/views/auth/SignUpInviteLink")),
    authority: [],
  },
  {
    key: "invite",
    path: `/invite`,
    component: lazy(() => import("@/views/auth/Invite")),
    authority: []
  },
];

export default authRoute;
