import { lazy } from "react";
import authRoute from "./authRoute";
import type { Routes } from "@/@types/routes";

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes = [
  {
    key: "admin.dashboard",
    path: "/dashboard",
    component: lazy(() => import("@/views/main/Dashboard")),
    authority: [],
  },
  {
    key: "admin.assessment",
    path: "/assessment",
    component: lazy(() => import("@/views/main/Assessment")),
    authority: [],
  },
  {
    key: "admin.scores",
    path: "/scores",
    component: lazy(() => import("@/views/main/Scores")),
    authority: [],
  },
  {
    key: "org.team",
    path: "/team",
    component: lazy(() => import("@/views/main/Team")),
    authority: [],
  },
  {
    key: "org.settings",
    path: "/settings",
    component: lazy(() => import("@/views/main/Settings")),
    authority: [],
  },
  {
    key: "org.rounds",
    path: "/rounds",
    component: lazy(() => import("@/views/main/Rounds")),
    authority: [],
  },
];
