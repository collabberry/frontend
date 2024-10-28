import { Navigate, useSearchParams } from "react-router-dom";
import appConfig from "@/configs/app.config";
import { useMemo } from "react";
import useAuth from "@/utils/hooks/useAuth";

const Invite = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { walletConnected } = useAuth();
  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);
  const { unAuthenticatedEntryPath, notRegisteredEntryPath, memberSignUpPath } = appConfig;

  if (invitationToken) {
    return (
      <Navigate
        to={`${walletConnected ?  memberSignUpPath : unAuthenticatedEntryPath}?invitationToken=${invitationToken}`}
        replace={true}
      />
    );
  }
  return <Navigate to={walletConnected ? notRegisteredEntryPath : unAuthenticatedEntryPath} replace={true} />;
};
export default Invite;
