import Card from "@/components/ui/Card";
import {
  apiGetInvitationToken,
  apiRemindContributors,
} from "@/services/OrgService";
import { RootState, setInvitationToken } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import { Avatar, Dialog, Skeleton } from "@/components/ui";
import InvitationLink from "./InvitationDialog";
import { HiOutlineCurrencyDollar, HiUsers } from "react-icons/hi";
import { useDeployTeamPoints } from "@/services/ContractsService";
import { ethers } from "ethers";

const Dashboard = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const user = useSelector((state: RootState) => state.auth.user);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const invitationToken = useSelector(
    (state: RootState) => state.auth.invite.invitationToken
  );
  const [loading, setLoading] = useState(false);
  const [teamPointsBalance, setTeamPointsBalance] = useState('');
  const { getBalance, ethersSigner } = useDeployTeamPoints();

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
      return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""
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

  useEffect(() => {
    const fetchBalance = async () => {
      if (organization?.teamPointsContractAddress && ethersSigner) {
        setLoading(true);
        const response = await getBalance(organization.teamPointsContractAddress);

        if (response.status === 'success' && response.data) {
          const { balance } = response.data;
          const formattedBalance = Math.floor(Number(ethers.formatUnits(balance, 'ether')));
          setTeamPointsBalance(formattedBalance.toString());
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    };
    fetchBalance();
  }, [organization.teamPointsContractAddress, ethersSigner]);

  return (
    <>
      {isInviteDialogOpen && (
        <Dialog isOpen={isInviteDialogOpen} onClose={handleClose}>
          <InvitationLink invitationToken={invitationToken} />
        </Dialog>
      )}
      <div className="px-4">
        <Card
          className="w-1/2 mb-4"
          bodyClass="h-full flex flex-col justify-between"
        >
          <h4>{`Welcome back, ${user.userName}!`}</h4>

          <div className="mt-4 flex flex-col gap-4">

            {loading ? (<>
              <Skeleton height={49}></Skeleton>
              <Skeleton height={49}></Skeleton>

            </>) :
              (
                <>
                  <div className="flex items-center gap-2">
                    <div>
                      <Avatar
                        size={45}
                        className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                        icon={
                          <HiOutlineCurrencyDollar className="text-2xl" />
                        }
                      />
                    </div>
                    <div>
                      <p>Total Fiat Received</p>
                      <h5 >
                        <span className="leading-none mr-1">{user.totalFiat ? +user.totalFiat : 0}</span>
                        <span className="text-sm leading-none">$</span>
                      </h5>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <Avatar
                        size={45}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                        icon={<HiUsers className="text-2xl" />}
                      />
                    </div>
                    <div>
                      <p>Total Team Points</p>
                      <h5 >
                        <span className="leading-none mr-1">{teamPointsBalance}</span>
                        <span className="text-sm leading-none">TP</span>
                      </h5>
                    </div>
                  </div>
                </>
              )}

          </div>
        </Card>
      </div>
      <div className="flex flex-col items-start h-full px-4">
        {user?.isAdmin && (
          <div className="w-full max-w-4xl mb-6">
            <h1 className="text-2xl font-bold mb-4">Steps to Complete</h1>
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
            <h1 className="text-2xl font-bold mb-4">My Organization</h1>
          ) : (
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-4">My Organization</h1>
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
                    {`TP ${organization?.totalDistributedTP
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
                    {`$${organization?.totalDistributedFiat
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
