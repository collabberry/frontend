import { Assessment } from "@/@types/auth";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { Button } from "@/components/ui";
import {
  apiActivateRounds,
  apiAddAssessment,
  apiGetCurrentRound,
} from "@/services/OrgService";
import { RootState, setAllRounds, setRounds, setSelectedRound } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { all } from "axios";
import { set } from "lodash";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const isCurrentRound = (round: any) => {
  const endDate = new Date(round.endDate);
  return endDate > new Date();
};

const Rounds: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const organization = useSelector((state: RootState) => state.auth.org);
  const { currentRound, selectedRound, allRounds } = useSelector(
    (state: RootState) => state.auth.rounds
  );

  //TODO: Change once there is a round id
  React.useEffect(() => {
    if (!allRounds || (allRounds.length === 0 && currentRound)) {
      dispatch(setAllRounds([currentRound]));
    }
  }, [allRounds, currentRound]);

  const handleRoundActivation = async () => {
    setLoading(true);
    if (currentRound && currentRound.status === RoundStatus.InProgress) {
      // TODO: Call deactivate round API
      console.log("Deactivating round");
      setLoading(false);
    } else {
      try {
        const response = await apiActivateRounds(organization.id || "");
        if (response?.data && organization.id) {
          try {
            const roundResponse = await apiGetCurrentRound(organization.id);
            if (roundResponse.data) {
              dispatch(setRounds(roundResponse.data));
            }
          } catch (error: any) {
            setLoading(false);
            handleError(error.response.data.message);
          }
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        handleError(error.response.data.message);
      }
    }
  };

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
              <Button
                size="sm"
                variant="plain"
                onClick={() => goToRound(round)}
              >
                Go to Round
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Rounds</h1>
      <div className="flex flex-col space-y-4 items-end justify-center mt-4">
        <Button
          size="sm"
          color={
            currentRound && currentRound.status === RoundStatus.InProgress
              ? ""
              : "berrylavender"
          }
          disabled={loading}
          variant={
            currentRound && currentRound.status === RoundStatus.InProgress
              ? undefined
              : "solid"
          }
          className="ltr:mr-2 rtl:ml-2 max-w-[150px]"
          onClick={handleRoundActivation}
        >
          {currentRound && currentRound.status === RoundStatus.InProgress
            ? "Deactivate Round"
            : "Activate Rounds"}
        </Button>
      </div>
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
        {allRounds.length ? (
          <CustomTableWithSorting data={allRounds || []} columns={columns} />
        ) : (
          <div className="text-center text-gray-500">
            Rounds have not yet been activated.
          </div>
        )}
      </div>
    </div>
  );
};

export default Rounds;
