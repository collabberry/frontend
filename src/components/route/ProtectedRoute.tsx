import appConfig from "@/configs/app.config";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/utils/hooks/useAuth";

const { unAuthenticatedEntryPath, notRegisteredEntryPath } = appConfig;

const ProtectedRoute = () => {
  const { authenticated, walletConnected } = useAuth();
  const location = useLocation();

  if (!authenticated && walletConnected) {
    return (
      <Navigate
        replace
        to={`${notRegisteredEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`}
      />
    );
  }

  if (!authenticated && !walletConnected) {
    return (
      <Navigate
        replace
        to={`${unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
