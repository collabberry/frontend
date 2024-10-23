import { Assessment } from "@/@types/auth";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { Button } from "@/components/ui";
import {
  apiActivateRounds,
  apiAddAssessment,
  apiGetCurrentRound,
} from "@/services/OrgService";
import { RootState, setAllRounds, setSelectedRound } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { all } from "axios";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const isCurrentRound = (round: any) => {
  const endDate = new Date(round.endDate);
  return endDate > new Date();
};

const Rounds: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRound, selectedRound, allRounds } = useSelector(
    (state: RootState) => state.auth.rounds
  );

  //TODO: Change once there is a round id
  React.useEffect(() => {
    if (!allRounds || (allRounds.length === 0 && currentRound)) {
      dispatch(setAllRounds([currentRound]));
    }
  }, [allRounds, currentRound]);

  const goToRound = (round: any) => {
    dispatch(setSelectedRound(round));
    navigate("round");
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Round",
      cell: (props) => {
        //TODO: Change once there is a round id
        const data = props.row.original;
        const value = props.getValue() as string;
        return <span>{"Round 1"}</span>;
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

        const statusString = (() => {
          switch (value) {
            case RoundStatus.NotStarted:
              return "Not Started";
            case RoundStatus.InProgress:
              return "In Progress";
            case RoundStatus.Completed:
              return "Completed";
            default:
              return "Unknown";
          }
        })();
        return <span>{statusString}</span>;
        {
        }
      },
    },
    // {
    //   header: "Team Points",
    //   accessorKey: "teamPoints",
    // },

    {
      header: "Go to Round",
      id: "round",
      cell: (props) => {
        const round = props.row.original;
        return (
          <div>
            {round && isCurrentRound(round) ? (
              <Button size="sm" variant="plain" onClick={() => goToRound(round)}>
                Go to Round
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  console.log("currentRound", currentRound, allRounds, selectedRound);

  return (
    <div>
      <h1>Rounds</h1>
      {/* <div className="flex flex-col space-y-4"> */}
      {/* <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
          onClick={() => apiActivateRounds(organization.id || "")}
        >
          Activate Rounds
        </button> */}
      {/* <button
          className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
          onClick={() => apiGetCurrentRound(organization.id || "")}
        >
          Get Current Round
        </button> */}
      {/* </div> */}
      <div className="mt-4">
        <CustomTableWithSorting data={allRounds || []} columns={columns} />
      </div>
    </div>
  );
};

export default Rounds;
