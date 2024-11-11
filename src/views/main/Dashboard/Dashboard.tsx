import Card from "@/components/ui/Card";
import {
  apiCreateOrganization,
  apiGetOrganizationById,
  apiEditOrganization,
  apiGetInvitationToken,
  apiGetContributorAgreement,
  apiCreateContributorAgreement,
  apiRemindContributors,
} from "@/services/OrgService";
import { RootState, setInvitationToken } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { apiGetUser } from "@/services/AuthService";
import { stat } from "fs";
import { get, set } from "lodash";
import useAuth from "@/utils/hooks/useAuth";
import InfoCard from "@/components/collabberry/custom-components/InfoCard";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { FiUserPlus } from "react-icons/fi";
import { FiPieChart } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";
import { FiDollarSign } from "react-icons/fi";
import {
  handleError,
  handleInfo,
  handleSuccess,
  openToastNotification,
} from "@/components/collabberry/helpers/ToastNotifications";
import { Dialog } from "@/components/ui";
import InvitationLink from "./InvitationDialog";

const Dashboard = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const isAdmin = useSelector((state: RootState) => state.auth.user.isAdmin);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const invitationToken = useSelector(
    (state: RootState) => state.auth.invite.invitationToken
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contributorsCardAction = () => {
    navigate("/team", { state: { from: "dashboard" } });
  };

  const settingsCardAction = () => {
    navigate("/settings");
  };

  const [isInviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleClose = () => {
    setInviteDialogOpen(false);
  };

  const inviteCardAction = async () => {
    if (!invitationToken) {
      try {
        const response = await apiGetInvitationToken();
        if (response.data) {
          dispatch(setInvitationToken(response.data));
        }
        setInviteDialogOpen(true);
      } catch (error: any) {
        handleError(error.response.data.message);
      }
    } else {
      setInviteDialogOpen(true);
    }
  };

  const assessmentCardAction = async () => {
    if (!currentRound?.id) {
      handleError(
        "The reminder can't be sent because there is no active round."
      );
      return;
    }
    try {
      const response = await apiRemindContributors(currentRound?.id, {
        all: true,
      });
      if (response) {
        handleSuccess("All members have been reminded!");
      }
    } catch (error: any) {
      handleError(error.response.data.message);
    }
  };

  const numberOfContributors = useMemo(() => {
    return organization?.contributors?.length || 0;
  }, [organization]);

  const numberOfContributorsWithAgreements = useMemo(() => {
    return (
      organization?.contributors?.filter(
        (contributor) =>
          contributor.agreement && Object.keys(contributor.agreement).length > 0
      ).length || 0
    );
  }, [organization]);

  // TODO: Replace hardcoded values with actual data
  // const currentRound = 1;
  const fiatPerRound = 1000;
  const pointsPerRound = 32000;
  const treasury = 18000;
  const runway = 7;

  const numberOfContributorsWithAssessments = useMemo(() => {
    return 0; // Hardcoded value for now
  }, []);

  return (
    <>
      {isInviteDialogOpen && (
        <Dialog isOpen={isInviteDialogOpen} onClose={handleClose}>
          <InvitationLink invitationToken={invitationToken} />
        </Dialog>
      )}
      <div className="flex flex-col items-center h-full px-4">
        <div className="w-full max-w-4xl mb-6">
          <h1 className="text-4xl font-bold mb-4">Steps to Complete</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              footerAction={
                numberOfContributorsWithAgreements < numberOfContributors
                  ? contributorsCardAction
                  : undefined
              }
              footerButtonTitle="Add all agreements"
              HeaderIcon={
                <FiFileText style={{ height: "100%", width: "100%" }} />
              }
              cardContent={
                <>
                  <strong>{numberOfContributorsWithAgreements}</strong> out of{" "}
                  <strong>{numberOfContributors}</strong> members of your
                  organisation have added agreements
                </>
              }
            />
            <InfoCard
              footerAction={settingsCardAction}
              footerButtonTitle="Settings"
              HeaderIcon={
                <FiSettings style={{ height: "100%", width: "100%" }} />
              }
              cardContent={
                <>
                  Set up your organisation’s compensation and assessment
                  information
                </>
              }
            />
            <InfoCard
              footerAction={inviteCardAction}
              footerButtonTitle="Invite Members"
              HeaderIcon={
                <FiUserPlus style={{ height: "100%", width: "100%" }} />
              }
              cardContent={<>Add more people to your organisation</>}
            />
          </div>
        </div>
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard
              //TODO: Implement logic to show correct number of contribitors with assessments
              footerAction={
                numberOfContributorsWithAssessments < numberOfContributors &&
                currentRound?.id
                  ? assessmentCardAction
                  : undefined
              }
              footerButtonTitle="Remind all"
              HeaderIcon={
                <FiPieChart style={{ height: "100%", width: "100%" }} />
              }
              cardContent={
                <>
                  <strong>{numberOfContributorsWithAssessments}</strong> out of{" "}
                  <strong>{numberOfContributors}</strong> members have completed
                  the assessment
                </>
              }
            />
            <InfoCard
              HeaderIcon={
                <FiCheckCircle style={{ height: "100%", width: "100%" }} />
              }
              cardContent={
                <div>
                  <p>Round total distributed</p>
                  <p className="text-lg font-bold">
                    TP{" "}
                    {pointsPerRound.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-lg font-bold">
                    ${" "}
                    {fiatPerRound.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              }
            />
            <InfoCard
              HeaderIcon={
                <FiDollarSign style={{ height: "100%", width: "100%" }} />
              }
              cardContent={
                <div>
                  <p>Treasury</p>
                  <p className="text-lg font-bold">
                    ${" "}
                    {treasury.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p>Runway</p>
                  <p className="text-lg font-bold">{runway} months</p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
