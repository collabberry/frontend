import { CustomCountdown } from "@/components/collabberry/custom-components/CustomCountdown";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { Avatar, Button } from "@/components/ui";
import { RootState } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import { HiCheck } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

const RoundView: React.FC = () => {
  const dispatch = useDispatch();
  // TODO: Change the source of contributors once round BE is ready, it should not be organization
  const organization = useSelector((state: RootState) => state.auth.org);
  const { selectedRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );

  const remind = (contributor: any) => {
    // TODO: Implement reminder functionality
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
      accessorKey: "monetaryCompensation",
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
      header: "Assessment",
      id: "assessment",
      cell: (props) => {
        const contributor = props.row.original;
        const hasSubmittedAssessment = false;
        return (
          <div>
            {hasSubmittedAssessment ? (
              <HiCheck className="text-berrylavender-500" />
            ) : (
              <Button
                size="sm"
                variant="plain"
                color="primary"
                onClick={() => remind(contributor)}
              >
                Remind
              </Button>
            )}
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
              data={organization?.contributors || []}
              columns={columns}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RoundView;
