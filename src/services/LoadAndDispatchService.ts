import { setOrganization, setUser } from "@/store";
import { apiGetCurrentRound, apiGetOrganizationById, apiGetRounds } from "./OrgService";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { Dispatch } from "react";
import { setAllRounds } from "@/store";
import { setCurrentRound } from "@/store";
import { apiGetUser } from "./AuthService";

export const refreshOrganizationData = async (orgId: string, dispatch: Dispatch<any>) => {
  try {
    const orgResponse = await apiGetOrganizationById(orgId as string);
    if (orgResponse.data) {
      dispatch(setOrganization(orgResponse.data));
    }
  } catch (error: any) {
    handleError(error.response.data.message);
  }
};

export const refreshAllRounds = async (dispatch: Dispatch<any>) => {
  try {
    const allRoundsResponse = await apiGetRounds();
    if (allRoundsResponse.data) {
      dispatch(setAllRounds(allRoundsResponse.data));
    } else {
      dispatch(setAllRounds([]));
    }
  } catch (error: any) {
    handleError(error.response.data.message);
  }
};

export const refreshCurrentRound = async (dispatch: Dispatch<any>) => {
  try {
    const roundResponse = await apiGetCurrentRound();
    if (roundResponse.data) {
      dispatch(setCurrentRound(roundResponse.data));
    } else {
      dispatch(setCurrentRound({}));
    }

  } catch (error: any) {
    handleError(error.response.data.message);
  }
};

export const refreshUser = async (dispatch: Dispatch<any>, onError: () => void) => {
  try {
    let response: any = await apiGetUser();
    let user = response?.data || {};
    if (user) {
      dispatch(
        setUser({
          id: user.id,
          profilePicture: user?.profilePicture,
          userName: response?.data?.username,
          authority: response?.data?.isAdmin ? ["ADMIN"] : ["USER"],
          email: response?.data?.email,
          telegramHandle: response?.data?.telegramHandle,
          isAdmin: response?.data?.isAdmin,
          totalFiat: response?.data?.totalFiat,
          organization: response?.data?.organization,
        })
      );
    }
  } catch (error) {
    onError();
  }
}

