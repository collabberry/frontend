import { Navigate, Outlet, useParams, useSearchParams } from "react-router-dom";
import appConfig from "@/configs/app.config";
import useAuth from "@/utils/hooks/useAuth";
import { useMemo } from "react";
import { useAppSelector } from "@/store";

const { authenticatedEntryPath } = appConfig;

const InviteRoute = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);
  const { token, signedIn } = useAppSelector((state) => state.auth.session);
  const isAuthenticated = useMemo(() => signedIn && token, [signedIn, token]);

  return invitationToken && isAuthenticated ? (
    <Navigate
      to={`/invite?invitationToken=${invitationToken}&alreadyLoggedIn=true`}
    />
  ) : (
    // : authenticated ? (
    //     <Navigate to={`${authenticatedEntryPath}?alreadyLoggedIn=true`} />
    // ) :
    // <Outlet />
    <Navigate to={`/invite?invitationToken=${invitationToken}`} />
  );
};

export default InviteRoute;
