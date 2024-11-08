import appConfig from "@/configs/app.config";
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { saveInvitationToken, useAppDispatch, useAppSelector } from "@/store";
import Dialog from "../ui/Dialog";
import { Container } from "../shared";
import useAuth from "@/utils/hooks/useAuth";

const { unAuthenticatedEntryPath, notRegisteredEntryPath, memberSignUpPath } =
  appConfig;

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { signOut } = useAuth();
  const {
    token,
    signedIn,
    invitationToken: invationBeforeDisconnect,
  } = useAppSelector((state) => state.auth.session);

  const isAuthenticated = useMemo(() => signedIn && token, [signedIn, token]);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);

  if (!isAuthenticated && !!token) {
    const url = invitationToken
      ? `${memberSignUpPath}?&invitationToken=${invitationToken}`
      : `${notRegisteredEntryPath}`;
    return <Navigate replace to={url} />;
  }

  if (!isAuthenticated && !token) {
    const url = invitationToken
      ? `${unAuthenticatedEntryPath}?&invitationToken=${invitationToken}`
      : `${unAuthenticatedEntryPath}`;
    return <Navigate replace to={url} />;
  }

  useEffect(() => {
    if (!!invationBeforeDisconnect && !dialogOpen) {
      setDialogOpen(true);
    }
  }, [invationBeforeDisconnect, dialogOpen]);

  const onClose = () => {
    setDialogOpen(false);
    dispatch(saveInvitationToken(""));
  };

  return (
    <>
      <Dialog onClose={onClose} isOpen={!!dialogOpen}>
        <Container>
=          <div>
            <button onClick={onClose}>Close Dialog</button>
            <button onClick={signOut}>Disconnect</button>
          </div>
        </Container>
      </Dialog>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
