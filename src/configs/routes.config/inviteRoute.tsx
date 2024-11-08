import { lazy } from "react";
import type { Routes } from "@/@types/routes";

const inviteRoute: Routes = [
  {
    key: "invite",
    path: `/invite`,
    component: lazy(() => import("@/views/auth/Invite")),
    authority: [],
  },
];

export default inviteRoute;
