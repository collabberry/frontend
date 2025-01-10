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
  const user = useSelector((state: RootState) => state.auth.user);
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

  const remainingFunds = useMemo(() => {
    return (
      (organization?.totalFunds ?? 0) -
      (organization?.totalDistributedFiat ?? 0)
    );
  }, [organization]);

  const runway = useMemo(() => {
    const contributorFiat = organization?.contributors?.reduce(
      (acc, contributor) => {
        return (
          acc +
          (contributor.agreement?.fiatRequested
            ? +contributor.agreement.fiatRequested
            : 0)
        );
      },
      0
    );

    const runway =
      contributorFiat && remainingFunds ? remainingFunds / contributorFiat : 0;

    const months = Math.floor(runway);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${
        remainingMonths !== 1 ? "s" : ""
      }`;
    } else {
      return `${months} month${months !== 1 ? "s" : ""}`;
    }
  }, [organization, remainingFunds]);

  const numberOfContributorsWithAssessments = useMemo(() => {
    if (currentRound?.contributors) {
      return currentRound.contributors.filter(
        (contributor: { hasAssessed: any }) => contributor.hasAssessed
      ).length;
    }
    return 0;
  }, []);

  return (
    <>
      {isInviteDialogOpen && (
        <Dialog isOpen={isInviteDialogOpen} onClose={handleClose}>
          <InvitationLink invitationToken={invitationToken} />
        </Dialog>
      )}
      <div className="flex flex-col items-start h-full px-4">
        {user?.isAdmin && (
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
        )}
        <div className="w-full max-w-4xl">
          {user?.isAdmin ? (
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          ) : (
            <div className="mb-4">
              <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
              <p>{`Welcome back, ${user.userName}!`}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRound && (
              <InfoCard
                //TODO: Implement logic to show correct number of contribitors with assessments
                footerAction={
                  numberOfContributorsWithAssessments < numberOfContributors &&
                  currentRound?.id &&
                  user?.isAdmin
                    ? assessmentCardAction
                    : undefined
                }
                footerButtonTitle="Remind all"
                HeaderIcon={
                  <FiPieChart style={{ height: "100%", width: "100%" }} />
                }
                cardContent={
                  <>
                    <strong>{numberOfContributorsWithAssessments}</strong> out
                    of <strong>{numberOfContributors}</strong> members have
                    completed the assessment
                  </>
                }
              />
            )}
            <InfoCard
              HeaderIcon={
                <FiCheckCircle style={{ height: "100%", width: "100%" }} />
              }
              cardContent={
                <div>
                  <p>Total distributed</p>
                  <p className="text-lg font-bold">
                    {`TP ${
                      organization?.totalDistributedTP
                        ? organization?.totalDistributedTP.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )
                        : "0"
                    }`}
                  </p>
                  <p className="text-lg font-bold">
                    {`$${
                      organization?.totalDistributedFiat
                        ? organization?.totalDistributedFiat.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )
                        : "0"
                    }`}
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
                    {organization.totalFunds
                      ? organization?.totalFunds.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })
                      : "Not Set"}
                  </p>
                  <p>Runway</p>
                  <p className="text-lg font-bold">{runway}</p>
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
