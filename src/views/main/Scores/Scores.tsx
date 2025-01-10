import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { RootState, setAllRounds, setSelectedRound } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import RoundStatusTag from "@/components/collabberry/custom-components/CustomFields/RoundStatusTag";
import { all } from "axios";
import { HiInformationCircle } from "react-icons/hi";

const Scores: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRound, selectedRound, allRounds } = useSelector(
    (state: RootState) => state.auth.rounds
  );

  React.useEffect(() => {
    if (!allRounds || (allRounds.length === 0 && currentRound)) {
      dispatch(setAllRounds([currentRound]));
    }
  }, [allRounds, currentRound]);

  const seeMyScores = (round: any) => {
    dispatch(setSelectedRound(round));
    navigate("my-scores");
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Round",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;
        return <span>{"Round 1"}</span>;
      },
    },
    {
      header: "Compensation Period",
      accessorKey: "compensationCycleStartDate",
      cell: (props) => {
        const value = props.getValue() as number;
        const row = props.row.original;
        const compensationCycleStartDate = new Date(
          row.compensationCycleStartDate
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
        const compensationCycleEndDate = new Date(
          row.compensationCycleEndDate
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });

        const dateRange =
          compensationCycleEndDate && compensationCycleStartDate
            ? `${compensationCycleStartDate} - ${compensationCycleEndDate}`
            : null;
        return dateRange ? <span>{dateRange}</span> : null;
      },
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      cell: (props) => {
        const value = props.getValue() as number;
        const formattedDate = new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return formattedDate ? <span>{formattedDate}</span> : null;
      },
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      cell: (props) => {
        const value = props.getValue() as number;
        const formattedDate = new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return formattedDate ? <span>{formattedDate}</span> : null;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (props) => {
        const value = props.getValue() as number;

        return <RoundStatusTag roundStatus={value} />;
      },
    },
    // {
    //   header: "Team Points",
    //   accessorKey: "teamPoints",
    // },

    {
      header: "My Scores",
      id: "round",
      cell: (props) => {
        const round = props.row.original;
        return (
          <div>
            {round && round.status === RoundStatus.Completed ? (
              <Button
                size="sm"
                variant="plain"
                onClick={() => seeMyScores(round)}
              >
                See My Scores
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Scores</h1>
      <div className="mt-4">
        {allRounds && allRounds.length ? (
          <CustomTableWithSorting data={allRounds || []} columns={columns} />
        ) : (
          <div className="mt-4 flex-row flex justify-start items-center bg-gray-100 dark:bg-gray-700 gap-1 p-3 rounded-lg">
            <HiInformationCircle className="text-2xl" />
            <div className="text-gray-500 font-semibold">
              There are no rounds available.
            </div>
            {/* <div>
              <Button
                size="sm"
                color="berrylavender"
                disabled={loading}
                variant="solid"
                className="ml-2 max-w-[150px]"
                onClick={() => handleRoundActivation(true)}
              >
                Activate Rounds
              </Button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scores;
