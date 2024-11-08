import { Navigate, Outlet, useParams, useSearchParams } from "react-router-dom";
import appConfig from "@/configs/app.config";
import useAuth from "@/utils/hooks/useAuth";
import { useAppSelector } from "@/store";
import { useMemo } from "react";

const { authenticatedEntryPath } = appConfig;

const PublicRoute = () => {
  const { token, signedIn } = useAppSelector((state) => state.auth.session);
  const isAuthenticated = useMemo(() => signedIn && token, [signedIn, token]);
  return isAuthenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />;
};

export default PublicRoute;
