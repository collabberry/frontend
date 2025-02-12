import { apiGetUser } from "@/services/AuthService";
import {
  setUser,
  signInSuccess,
  walletConnected,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
  setOrganization,
  resetUser,
  resetOrganization,
  resetInvitationToken,
  resetRoundsState,
  saveInvitationToken,
  resetAdmins,
} from "@/store";
import appConfig from "@/configs/app.config";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useMemo } from "react";
import {
  apiGetOrganizationById,
} from "@/services/OrgService";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { useAdminContractService } from "@/services/AdminContractService";
import { refreshAllRounds, refreshCurrentRound } from "@/services/LoadAndDispatchService";

type Status = "success" | "failed";

function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { checkIsAdmin, ethersSigner } = useAdminContractService();
  const { disconnectAsync } = useDisconnect();
  const { isDisconnected } = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    token,
    signedIn,
    invitationToken: savedInvinationToken,
  } = useAppSelector((state) => state.auth.session);

  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken") || savedInvinationToken;
  }, [searchParams.get("invitationToken"), savedInvinationToken]);



  const signInWithWallet = async (
    token: string
  ): Promise<
    | {
      status: Status;
      message: string;
    }
    | undefined
  > => {
    try {
      if (token) {
        dispatch(walletConnected(token));
        let response: any = await apiGetUser();
        let user = response?.data || {};
        let url = appConfig.authenticatedEntryPath;
        if (!user || !user.organization) {
          user.username = "Anonymous";
          user.email = "";
          user.profilePicture = "";
          url = invitationToken
            ? `${appConfig.notRegisteredEntryPath}?invitationToken=${invitationToken}`
            : appConfig.notRegisteredEntryPath;
        } else {
          dispatch(signInSuccess(token));
        }

        dispatch(
          setUser({
            profilePicture: user?.profilePicture,
            userName: user?.username,
            authority: user?.isAdmin ? ["ADMIN"] : ["USER"],
            email: user?.email,
            telegramHandle: user?.telegramHandle,
            id: user?.id,
            isAdmin: user?.isAdmin,
            totalFiat: user?.totalFiat,
            organization: user?.organization,
          })
        );
        if (user?.organization?.id) {
          try {
            const orgResponse = await apiGetOrganizationById(
              user?.organization?.id
            );

            dispatch(
              setOrganization({
                ...orgResponse?.data,
                logo: orgResponse?.data?.logo,
              })
            );
          } catch (error: any) {
            handleError(error.response.data.message);
          }

          refreshAllRounds(dispatch);
          refreshCurrentRound(dispatch);
        }
        navigate(url);
        return {
          status: "success",
          message: "",
        };
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const getOrganizationData = async (orgId: string) => {
    try {
      const response = await apiGetOrganizationById(orgId); // Assuming apiGetUser fetches organization details as well
      if (response.data) {
        return {
          status: "success",
          organization: response.data,
        };
      } else {
        return {
          status: "failed",
          message: "Organization not found",
        };
      }
    } catch (errors: any) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(signOutSuccess());
    dispatch(resetUser());
    dispatch(resetOrganization());
    dispatch(resetAdmins());
    dispatch(resetInvitationToken());
    dispatch(resetRoundsState());

    if (invitationToken) {
      navigate(
        `${appConfig.unAuthenticatedEntryPath}?invitationToken=${invitationToken}`
      );
    } else {
      setSearchParams({ invitationToken: "" });
      navigate(appConfig.unAuthenticatedEntryPath);
    }

    dispatch(saveInvitationToken(""));
  };

  useEffect(() => {
    if (isDisconnected) {
      handleSignOut();
    }
  }, [isDisconnected, invitationToken]);

  useEffect(() => {
    if (token && signedIn && invitationToken) {
      dispatch(saveInvitationToken(invitationToken));
    }
  }, [token, signedIn, invitationToken]);

  const signOut = async () => {
    await disconnectAsync();
    handleSignOut();
  };

  return {
    signInWithWallet,
    signOut,
    getOrganizationData,
  };
}

export default useAuth;
