import { CustomCountdown } from "@/components/collabberry/custom-components/CustomCountdown";
import RoundStatusTag from "@/components/collabberry/custom-components/CustomFields/RoundStatusTag";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import LoadingDialog from "@/components/collabberry/custom-components/LoadingDialog";
import ErrorDialog from "@/components/collabberry/custom-components/TransactionErrorDialog";
import SuccessDialog from "@/components/collabberry/custom-components/TransactionSuccessDialog";
import {
  handleError,
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { Avatar, Button, Tag } from "@/components/ui";
import { useDeployTeamPoints } from "@/services/ContractsService";
import { apiRemindContributors } from "@/services/OrgService";
import { RootState, setSelectedUser } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { set } from "lodash";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import { HiArrowSmLeft, HiCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RoundView: React.FC = () => {
  const { selectedRound, currentRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );
  const organization = useSelector((state: RootState) => state.auth.org);
  const user = useSelector((state: RootState) => state.auth.user);
  const { batchMint, ethersSigner } = useDeployTeamPoints();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [contributors, setContributors] = React.useState<any[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errrorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const txBlockExplorer = 'https://sepolia.arbiscan.io/tx/'
  const txNetwork = 'Arbitrum Sepolia';

  const goToContributorAssessments = (contributor: any) => {
    const orgContributor = organization?.contributors?.find(
      (orgContrib: any) => orgContrib.id === contributor.id
    );
    const enhancedContributor = {
      ...contributor,
      profilePicture: orgContributor?.profilePicture || "",
    };
    dispatch(setSelectedUser(enhancedContributor));
    navigate("/rounds/round/contributor-scores");
  };

  React.useEffect(() => {
    if (selectedRound?.contributors) {
      const contributorsWithReminder = selectedRound.contributors.map(
        (contributor: any) => ({
          ...contributor,
          reminded: false,
          loading: false,
        })
      );
      setContributors(contributorsWithReminder);
    }
  }, []);

  const remind = async (contributor: any) => {
    const loadingContributor = contributors.map((c) =>
      c.id === contributor?.id ? { ...c, loading: true } : c
    );
    setContributors(loadingContributor);

    try {
      const response = await apiRemindContributors(selectedRound?.id, {
        users: [contributor?.id],
      });

      if (response) {
        const updatedContributors = contributors.map((c) =>
          c.id === contributor?.id ? { ...c, reminded: true } : c
        );
        setContributors(updatedContributors);
        handleSuccess(`Reminder sent to ${contributor.username}!`);
      }
    } catch (error: any) {
      const loadingContributor = contributors.map((c) =>
        c.id === contributor?.id ? { ...c, loading: false } : c
      );
      setContributors(loadingContributor);
      handleError(error.response.data.message);
    }
  };
  const columnsWithoutReminderAndViewAssessments: ColumnDef<any>[] = [
    {
      header: "Member",
      accessorKey: "username",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;
        return (
          <CustomAvatarAndUsername
            imageUrl={data?.profilePicture}
            userName={value}
          />
        );
      },
    },
    {
      header: "Total Score",
      accessorKey: "totalScore",
      cell: (props) => {
        const value = props.getValue() as number;
        return value ? <span>{value.toFixed(1)}</span> : null;
      },
    },
    {
      header: "Culture Impact",
      accessorKey: "cultureScore",
      cell: (props) => {
        const value = props.getValue() as number;
        return value ? <span>{value.toFixed(1)}</span> : null;
      },
    },
    {
      header: "Work",
      accessorKey: "workScore",
      cell: (props) => {
        const value = props.getValue() as number;
        return value ? <span>{value.toFixed(1)}</span> : null;
      },
    },
    {
      header: "Team Points",
      accessorKey: "teamPoints",
      cell: (props) => {
        const value = props.getValue() as number;
        return value ? <span>{value.toFixed(0)}</span> : null;
      },
    },
    {
      header: "Fiat",
      accessorKey: "fiat",
      cell: (props) => {
        const value = props.getValue() as number;
        if (value) {
          return (
            <span>
              $
              {Number(props.getValue() as number).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          );
        }
      },
    },
  ];

  const columnsWithoutReminder: ColumnDef<any>[] = [
    ...columnsWithoutReminderAndViewAssessments,
    {
      header: "Assessments",
      id: "viewAssessments",
      cell: (props) => {
        const contributor = props.row.original;
        const reminded = contributor.reminded;

        return (
          <div className="flex flex-row justify-center">
            <Button
              size="sm"
              loading={contributor.loading}
              disabled={false}
              onClick={(event) => {
                event.preventDefault();
                goToContributorAssessments(contributor);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const adminColumns: ColumnDef<any>[] = [
    ...columnsWithoutReminderAndViewAssessments,
    {
      header: "Has Assessed",
      id: "hasAssessed",
      cell: (props) => {
        const contributor = props.row.original;
        const reminded = contributor.reminded;
        const isCurrentUser = contributor.id === user?.id;

        return (
          <>
            {isCurrentUser ? (
              <></>
            ) : (
              <div className="flex flex-row justify-center">
                {contributor.hasAssessed ? (
                  <HiCheck className="text-berrylavender-500 text-2xl font-semibold" />
                ) : selectedRound?.id === currentRound?.id && !reminded ? (
                  <Button
                    size="sm"
                    loading={contributor.loading}
                    disabled={contributor.loading}
                    onClick={() => remind(contributor)}
                  >
                    Remind
                  </Button>
                ) : (
                  <Button size="sm" disabled={true}>
                    Reminded!
                  </Button>
                )}
              </div>
            )}
          </>
        );
      },
    },
    {
      header: "Assessments",
      id: "viewAssessments",
      cell: (props) => {
        const contributor = props.row.original;
        const reminded = contributor.reminded;

        return (
          <div className="flex flex-row justify-start">
            <Button
              size="sm"
              disabled={false}
              onClick={(event) => {
                event.preventDefault();
                goToContributorAssessments(contributor);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const navigateBack = () => {
    navigate(-1);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    setTxHash(null);
  };

  const mintTeamPoints = async () => {


    if (organization?.teamPointsContractAddress) {

      //TODO: Replace when contributors returns walletAddress
      const enhancedContributors = contributors.map((contributor) => {
        const orgContributor = organization?.contributors?.find(
          (orgContrib: any) => orgContrib.id === contributor.id
        );
        return {
          ...contributor,
          walletAddress: orgContributor?.walletAddress || "",
        };
      });
      const recipients = enhancedContributors.map(contributor => contributor.walletAddress);
      const materialWeight = enhancedContributors.map(() => 0);
      const timeContributions = enhancedContributors.map(contributor => contributor.teamPoints);


      try {
        setLoading(true);
        const response = await batchMint(
          organization?.teamPointsContractAddress,
          recipients,
          materialWeight,
          timeContributions
        );

        if (response?.status === 'success') {
          setTxHash(response?.data?.transactionHash || '');
          setLoading(false);
          setDialogVisible(true);


        } else {
          setLoading(false);
          setErrorDialogVisible(true);
          setErrorMessage(response?.message || "An error occurred while minting the tokens.");
        }
      } catch (error: any) {
        setLoading(false);
        setErrorDialogVisible(true);
        setErrorMessage(error?.message || "An error occurred while minting the tokens.");
      }
    }

  }

  return (
    <>
      {selectedRound && (
        <div>
          <SuccessDialog
            dialogVisible={dialogVisible}
            txHash={txHash || ''}
            txBlockExplorer={txBlockExplorer}
            txNetwork={txNetwork}
            dialogMessage="Yay! The tokens have been minted successfully."
            handleDialogClose={handleDialogClose}>
          </SuccessDialog>
          <ErrorDialog dialogVisible={errrorDialogVisible}
            errorMessage={errorMessage || ''}
            handleDialogClose={() => setErrorDialogVisible(false)}   >
          </ErrorDialog>
          <LoadingDialog dialogVisible={loading}
            message={'You will be promped to sign a transaction. This might take a while, so please be patient.'}
            title="Minting Tokens..."
            handleDialogClose={() => null}   >
          </LoadingDialog>

          <div>
            <Button
              size="sm"
              className="mb-2"
              onClick={navigateBack}
              icon={<HiArrowSmLeft />}
            >
              Back to Rounds
            </Button>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row justify-start items-center gap-2">
              <h1>Round {selectedRound?.roundNumber}</h1>
              <RoundStatusTag roundStatus={selectedRound?.status} />
            </div>
            {user?.isAdmin && selectedRound?.status === RoundStatus.Completed && (<div>
              <Button type="button" onClick={mintTeamPoints}>
                Mint Team Points
              </Button>
            </div>)}
            {selectedRound?.status === RoundStatus.InProgress && (
              <div className="flex flex-row items-center rounded bg-gray-200 p-2">
                <FiClock className="text-berrylavender-500 mr-2 text-2xl" />
                <div className="text-gray-900 mr-2 text-lg">Time left</div>
                <Countdown
                  date={selectedRound?.endDate}
                  renderer={CustomCountdown}
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <CustomTableWithSorting
              data={contributors || []}
              columns={
                user?.isAdmin &&
                  selectedRound?.status === RoundStatus.InProgress
                  ? adminColumns
                  : user?.isAdmin &&
                    selectedRound?.status !== RoundStatus.InProgress
                    ? columnsWithoutReminder
                    : !user?.isAdmin &&
                      selectedRound?.status === RoundStatus.InProgress
                      ? columnsWithoutReminderAndViewAssessments
                      : columnsWithoutReminder
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RoundView;
