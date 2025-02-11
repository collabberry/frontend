import { setOrganization } from "@/store";
import { apiGetCurrentRound, apiGetOrganizationById, apiGetRounds } from "./OrgService";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { Dispatch } from "react";
import { setAllRounds } from "@/store";
import { setCurrentRound } from "@/store";

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
      } else{
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