import {
  apiGetUser,
  apiSignIn,
  apiSignOut,
  apiSignUp,
} from "@/services/AuthService";
import {
  setUser,
  signInSuccess,
  walletConnected,
  signOutSuccess,
  useAppSelector,
  useAppDispatch,
  setOrganization,
  setInvitationToken,
  resetUser,
  resetOrganization,
  resetInvitationToken,
  setRounds,
  resetRoundsState,
} from "@/store";
import appConfig from "@/configs/app.config";
import { REDIRECT_URL_KEY } from "@/constants/app.constant";
import { useNavigate, useSearchParams } from "react-router-dom";
import useQuery from "./useQuery";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useMemo } from "react";
import {
  apiGetCurrentRound,
  apiGetOrganizationById,
} from "@/services/OrgService";
import { set } from "lodash";

type Status = "success" | "failed";

function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { disconnectAsync } = useDisconnect();
  const { isDisconnected } = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();

  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);
  const { token, signedIn } = useAppSelector((state) => state.auth.session);

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
        if (!user) {
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
            id: user?.id,
            isAdmin: user?.isAdmin,
          })
        );
        if (user?.organization?.id) {
          const orgResponse = await apiGetOrganizationById(
            user?.organization?.id
          );
          dispatch(
            setOrganization({
              ...orgResponse?.data,
              logo: orgResponse?.data?.logo,
            })
          );
          const roundResponse = await apiGetCurrentRound(user.organization.id);
          if (roundResponse.data) {
            dispatch(setRounds(roundResponse.data));
          }
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

  // const signUp = async (values: SignUpCredential) => {
  //   try {
  //     const resp = await apiSignUp(values);
  //     if (resp.data) {
  //       const { token } = resp.data;
  //       dispatch(signInSuccess(token));
  //       if (resp.data.user) {
  //         dispatch(
  //           setUser(
  //             resp.data.user || {
  //               avatar: "",
  //               userName: "Anonymous",
  //               authority: ["USER"],
  //               email: "",
  //               id: ""
  //             }
  //           )
  //         );
  //       }
  //       const redirectUrl = query.get(REDIRECT_URL_KEY);
  //       navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
  //       return {
  //         status: "success",
  //         message: "",
  //       };
  //     }
  //     // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  //   } catch (errors: any) {
  //     return {
  //       status: "failed",
  //       message: errors?.response?.data?.message || errors.toString(),
  //     };
  //   }
  // };

  const handleSignOut = () => {
    dispatch(signOutSuccess());
    dispatch(resetUser());
    dispatch(resetOrganization());
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
  };

  useEffect(() => {
    if (isDisconnected) {
      handleSignOut();
    }
  }, [isDisconnected, invitationToken]);

  const signOut = async () => {
    await disconnectAsync();
    handleSignOut();
  };

  return {
    authenticated: token && signedIn,
    walletConnected: token,
    signInWithWallet,
    signOut,
    getOrganizationData,
  };
}

export default useAuth;
