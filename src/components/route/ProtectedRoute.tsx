import appConfig from "@/configs/app.config";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import {
  Navigate,
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useAuth from "@/utils/hooks/useAuth";
import { useMemo } from "react";

const { unAuthenticatedEntryPath, notRegisteredEntryPath, memberSignUpPath } = appConfig;

const ProtectedRoute = () => {
  const { authenticated, walletConnected } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);

  if (!authenticated && walletConnected) {
    const url = invitationToken
      ? `${memberSignUpPath}?&invitationToken=${invitationToken}`
      : `${notRegisteredEntryPath}`;
    return <Navigate replace to={url} />;
  }

  if (!authenticated && !walletConnected) {
    const url = invitationToken
      ? `${unAuthenticatedEntryPath}?&invitationToken=${invitationToken}`
      : `${unAuthenticatedEntryPath}`;
    return <Navigate replace to={url} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
