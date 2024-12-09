import { CustomCountdown } from "@/components/collabberry/custom-components/CustomCountdown";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import {
  handleError,
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import { Avatar, Button } from "@/components/ui";
import { apiRemindContributors } from "@/services/OrgService";
import { RootState, setSelectedUser } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { set } from "lodash";
import React from "react";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import { HiCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RoundView: React.FC = () => {
  const { selectedRound, currentRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );
  const organization = useSelector((state: RootState) => state.auth.org);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [contributors, setContributors] = React.useState<any[]>([]);

  const goToContributorAssessments = (contributor: any) => {
    const orgContributor = organization?.contributors?.find(
      (orgContrib: any) => orgContrib.id === contributor.id
    );
    const enhancedContributor = {
      ...contributor,
      profilePicture: orgContributor?.profilePicture || "",
    };
    dispatch(setSelectedUser(enhancedContributor));
    console.log("enhancedContributor", enhancedContributor);
    navigate("/rounds/round/contributor-scores");
  };

  React.useEffect(() => {
    if (currentRound?.contributors) {
      const contributorsWithReminder = currentRound.contributors.map(
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

  const roundId = 1;
  const columns: ColumnDef<any>[] = [
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
    // {
    //   header: "Team Points",
    //   accessorKey: "agreement.teamPoints",
    // },
    // {
    //   header: "Team Points",
    //   accessorKey: "agreement.teamPointsShare",
    //   cell: (props) => {
    //     const value = props.getValue() as number;
    //     return value ? <span>{value}%</span> : null;
    //   },
    // },
    {
      header: "Has Assessed",
      id: "hasAssessed",
      cell: (props) => {
        const contributor = props.row.original;
        const reminded = contributor.reminded;

        return (
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

  return (
    <>
      {selectedRound && (
        <div>
          <div className="flex flex-row justify-between">
            <h1>Round {roundId}</h1>
            <div className="flex flex-row items-center rounded bg-gray-200 p-2">
              <FiClock className="text-berrylavender-500 mr-2 text-2xl" />
              <div className="text-gray-900 mr-2 text-lg">Time left</div>
              <Countdown
                date={selectedRound?.endDate}
                renderer={CustomCountdown}
              />
            </div>
          </div>
          <div className="mt-4">
            <CustomTableWithSorting
              data={contributors || []}
              columns={columns}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RoundView;
