import { lazy } from "react";
import authRoute from "./authRoute";
import type { Routes } from "@/@types/routes";
import { relative } from "path";

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes = [
  {
    key: "admin.dashboard",
    path: "/dashboard",
    component: lazy(() => import("@/views/main/Dashboard/Dashboard")),
    authority: [],
  },
  {
    key: "admin.assessment",
    path: "/assessment",
    component: lazy(() => import("@/views/main/Assessment/Assessment")),
    authority: [],  
 
  },
  {
    key: "admin.assess",
    path: "/assessment/assess",
    relative: true,
    component: lazy(() => import("@/views/main/Assessment/Assess")),
    authority: [],
  },
  {
    key: "admin.scores",
    path: "/scores",
    component: lazy(() => import("@/views/main/Scores/Scores")),
    authority: [],
  },
  {
    key: "org.team",
    path: "/team",
    component: lazy(() => import("@/views/main/Team/Team")),
    authority: [],
  },
  {
    key: "org.settings",
    path: "/settings",
    component: lazy(() => import("@/views/main/Settings/Settings")),
    authority: [],
  },
  {
    key: "org.rounds",
    path: "/rounds",
    component: lazy(() => import("@/views/main/Rounds/Rounds")),
    authority: [],
  },
  {
    key: "org.round",
    path: "/rounds/round",
    component: lazy(() => import("@/views/main/Rounds/RoundView")),
    authority: [],
  },
];
