import Card from "@/components/ui/Card";
import {
  apiGetInvitationToken,
  apiRemindContributors,
} from "@/services/OrgService";
import { RootState, setInvitationToken, setUser } from "@/store";
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
import {
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import { Button, Dialog, Skeleton, Tooltip } from "@/components/ui";
import InvitationLink from "./InvitationDialog";
import { HiOutlineCurrencyDollar, HiUsers } from "react-icons/hi";
import { useContractService } from "@/services/ContractsService";
import { MdDonutSmall } from "react-icons/md";
import { ethers } from "ethers";
import { apiGetUser } from "@/services/AuthService";
import PurpleBerryLogo from "@/assets/svg/PurpleBerryLogo";
import { SvgIcon } from "@/components/shared";
import { StatRow } from "@/components/collabberry/custom-components/StatRow";
import teamPic from '@/assets/images/team.png';
import useAuth from '@/utils/hooks/useAuth'
import { refreshCurrentRound, refreshUser } from "@/services/LoadAndDispatchService";
import { RiCopperCoinFill } from "react-icons/ri";
import { useHandleError } from "@/services/HandleError";




const Dashboard = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const handleError  = useHandleError();
  const { signOut } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const invitationToken = useSelector(
    (state: RootState) => state.auth.invite.invitationToken
  );
  const [loading, setLoading] = useState(false);
  const [teamPointsBalance, setTeamPointsBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const { getBalance, fetchTotalSupply, fetchTokenDetailsAndAddToWallet, ethersSigner } = useContractService();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contributorsCardAction = () => {
    navigate("/team", { state: { from: "dashboard" } });
  };

  const settingsCardAction = () => {
    navigate("/settings");
  };

  const manualAllocationAction = () => {
    navigate("/team/manual-allocation");
  }


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
        handleError(error);
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
      handleError(error);
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


  const numberOfContributorsWithAssessments = useMemo(() => {
    if (currentRound?.contributors) {
      return currentRound.contributors.filter(
        (contributor: { hasAssessed: any }) => contributor.hasAssessed
      ).length;
    }
    return 0;
  }, [currentRound]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (organization?.teamPointsContractAddress && ethersSigner) {
        setLoading(true);
        const response = await getBalance(organization?.teamPointsContractAddress);
        if (response.status === 'success' && response.data) {
          const { balance } = response.data;
          const formattedBalance = Math.floor(Number(ethers.formatUnits(balance, 'ether')));
          setTeamPointsBalance(formattedBalance);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    };

    const fetchSupply = async () => {
      if (organization?.teamPointsContractAddress && ethersSigner) {
        setLoading(true);
        const response = await fetchTotalSupply(organization?.teamPointsContractAddress);
        if (response.status === 'success' && response.data) {
          const { totalSupply } = response.data;
          const formattedTotalSupply = Math.floor(Number(ethers.formatUnits(totalSupply, 'ether')));
          setTotalSupply(formattedTotalSupply);
          setLoading(false);
        } else {
          setLoading(false);

        }
      }
    }
    fetchBalance();
    fetchSupply();
  }, [organization.teamPointsContractAddress, ethersSigner]);

  useEffect(() => {
    const fetchUser = async () => {
      refreshUser(dispatch, handleError);
    };
    fetchUser();
  }, [])

  useEffect(() => {
    refreshCurrentRound(dispatch, handleError);
  }, []);


  const adminCards = [
    {
      footerAction: inviteCardAction,
      footerButtonTitle: "Invite Members",
      footerButtonIcon: <FiUserPlus style={{ height: "100%", width: "100%" }} />,
      cardContent: <>Add more people to your <br /> organisation</>,
    },
    {
      footerAction: settingsCardAction,
      footerButtonTitle: "Settings",
      footerButtonIcon: <FiSettings style={{ height: "100%", width: "100%" }} />,
      cardContent: <>Set up your organisation’s compensation and assessment</>,
    },
    {
      footerAction: manualAllocationAction,
      footerButtonTitle: "Manual Allocation",
      footerButtonIcon: <FiPieChart style={{ height: "100%", width: "100%" }} />,
      cardContent: <>Manually allocate team points to contributors</>,
    },
    {
      footerAction: numberOfContributorsWithAgreements < numberOfContributors ? contributorsCardAction : undefined,
      footerButtonTitle: "Add agreements",
      footerButtonIcon: <FiFileText style={{ height: "100%", width: "100%" }} />,
      cardContent: (
        <>
          <strong>{numberOfContributorsWithAgreements}</strong> out of <strong>{numberOfContributors}</strong> members of your organisation have added agreements
        </>
      ),
      condition: numberOfContributorsWithAgreements < numberOfContributors
    }
  ];

  const organizationCards = [
    {
      headerIcon: <FiPieChart style={{ height: "100%", width: "100%" }} />,
      cardContent: (
        <>
          <strong>{numberOfContributorsWithAssessments}</strong> out of <strong>{numberOfContributors}</strong> members have completed the assessment
        </>
      ),
      footerAction: numberOfContributorsWithAssessments < numberOfContributors && currentRound?.id && user?.isAdmin ? assessmentCardAction : undefined,
      footerButtonTitle: "Remind all",
      condition: currentRound && user?.isAdmin
    },
    {
      headerIcon: <FiCheckCircle style={{ height: "100%", width: "100%" }} />,
      cardContent: (
        <div>
          <p>Total distributed</p>
          <p className="text-lg font-bold">
            {`TP ${totalSupply ? totalSupply.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "0"}`}
          </p>
          <p className="text-lg font-bold">
            {`$${organization?.totalDistributedFiat ? organization?.totalDistributedFiat.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "0"}`}
          </p>
        </div>
      )
    }
  ];

  const stats = [
    {
      icon: <HiUsers className="text-2xl" />,
      label: "Your Team Points",
      value: teamPointsBalance.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      valueSuffix: "TP",
      className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
    },
    {
      icon: <MdDonutSmall className="text-2xl" />,
      label: "Your Team Points Share",
      value: ((teamPointsBalance && totalSupply ? teamPointsBalance / totalSupply : 0) * 100).toFixed(2),
      valueSuffix: "%",
      className: "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-100"
    },
    {
      icon: <HiOutlineCurrencyDollar className="text-2xl" />,
      label: "Total Fiat Received",
      value: (+(user.totalFiat || 0)).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      valueSuffix: "$",
      className: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
    },
    {
      icon: <SvgIcon><PurpleBerryLogo /></SvgIcon>,
      label: "Total TP Supply",
      value: totalSupply.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      valueSuffix: "TP",
      className: "bg-berrylavender-100 text-berrylavender-600 dark:bg-berrylavender-500/20 dark:text-berrylavender-100"
    },
  ]

  return (
    <>
      {isInviteDialogOpen && (
        <Dialog isOpen={isInviteDialogOpen} onClose={handleClose}>
          <InvitationLink invitationToken={invitationToken} />
        </Dialog>
      )}

      {/* stats card */}
      <div className="px-4">
        <Card
          className="w-full sm:w-full md:w-full xl:w-3/4 2xl:w-1/2 mb-4"
          bodyClass="h-full flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <h4>{`Welcome back, ${user.userName}!`}</h4>

            <Tooltip title="Add Token to Wallet">
              <Button
                size="sm"
                shape="circle"
                icon={<RiCopperCoinFill />}
                variant="twoTone"
                color="berrylavender"
                onClick={() => fetchTokenDetailsAndAddToWallet(organization?.teamPointsContractAddress || "", organization?.logo || "")}
              >
              </Button>
            </Tooltip>
          </div>



          <div className="mt-4 flex flex-col gap-4">
            {loading ? (
              Array(2)
                .fill(0)
                .map((_, index) => <Skeleton height={49} key={index} />)
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <StatRow
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    valueSuffix={stat.valueSuffix}
                    className={stat.className}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* admin and org cards */}
      <div className="flex flex-col items-start h-full px-4">
        {user?.isAdmin && (
          <div className="w-full mb-6">
            <h1 className="text-2xl font-bold mb-4">Steps to Complete</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              {adminCards.map((card, index) =>
                card.condition !== false && (
                  <InfoCard
                    key={index}
                    footerAction={card.footerAction}
                    footerButtonTitle={card.footerButtonTitle}
                    step={index + 1}
                    footerButtonIcon={card.footerButtonIcon}
                    cardContent={card.cardContent}
                  />
                )
              )}
            </div>
          </div>
        )}
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4">My Organization</h1>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            <div className="max-h-48 2xl:max-h-68">
              <img
                src={teamPic}
                className="rounded object-cover w-full h-full"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {organizationCards.map(
                (card, index) =>
                  card.condition !== false && (
                    <InfoCard
                      key={index}
                      headerIcon={card.headerIcon}
                      cardContent={card.cardContent}
                      footerAction={card.footerAction}
                      footerButtonTitle={card.footerButtonTitle}
                    />
                  )
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
