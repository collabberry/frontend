import { Navigate, useSearchParams } from "react-router-dom";
import appConfig from "@/configs/app.config";
import { useMemo } from "react";
import useAuth from "@/utils/hooks/useAuth";
import { useAppSelector } from "@/store";

const Invite = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAppSelector((state) => state.auth.session);
  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);
  const { unAuthenticatedEntryPath, notRegisteredEntryPath, memberSignUpPath } = appConfig;

  if (invitationToken) {
    return (
      <Navigate
        to={`${!!token ?  memberSignUpPath : unAuthenticatedEntryPath}?invitationToken=${invitationToken}`}
        replace={true}
      />
    );
  }
  return <Navigate to={!!token ? notRegisteredEntryPath : unAuthenticatedEntryPath} replace={true} />;
};
export default Invite;
