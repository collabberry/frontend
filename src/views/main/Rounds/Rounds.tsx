import { Assessment } from "@/@types/auth";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { Button, Switcher } from "@/components/ui";
import {
  apiActivateRounds,
  apiAddAssessment,
  apiGetCurrentRound,
  apiGetOrganizationById,
} from "@/services/OrgService";
import {
  RootState,
  setAllRounds,
  setOrganization,
  setRounds,
  setSelectedRound,
} from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { all } from "axios";
import { set } from "lodash";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Rounds: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const organization = useSelector((state: RootState) => state.auth.org);
  const [roundsStatus, setRoundsStatus] = React.useState(
    organization?.roundsActivated
  );
  const { isAdmin } = useSelector((state: RootState) => state.auth.user);
  const { allRounds, currentRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );

  const isCurrentRound = (round: any) => {
    return round.id === currentRound.id;
  };

  const getRoundNumber = (id: string) => {
    if (!id) return "";
    const index = allRounds.findIndex((r) => r.id === id);
    return allRounds.length - index;
  };

  const handleRoundActivation = async (event: boolean) => {
    setLoading(true);
    try {
      const response = await apiActivateRounds({
        isActive: event,
      });
      if (organization?.id) {
        // try {
        //   const roundResponse = await apiGetCurrentRound();
        //   if (roundResponse?.data) {
        //     dispatch(setRounds(roundResponse.data));
        //   }
        // } catch (error: any) {
        //   setLoading(false);
        //   handleError(error.response.data.message);
        // }
        try {
          const orgResponse = await apiGetOrganizationById(organization.id);
          if (orgResponse?.data) {
            dispatch(setOrganization(orgResponse.data));
          }
        } catch (error: any) {
          setLoading(false);
          handleError(error.response.data.message);
        }
      }
      setRoundsStatus(event);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      handleError(error.response.data.message);
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
        const data = props.row.original;
        const value = props.getValue() as string;
        return <span>{`Round ${getRoundNumber(data?.id)}`}</span>;
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
      {isAdmin && (
        <div className="flex flex-col space-y-4 items-end justify-center mt-4">
          <div className="mb-4">
            <Switcher
              checkedContent="Active"
              unCheckedContent="Paused"
              isLoading={loading}
              onChange={handleRoundActivation}
              defaultChecked={roundsStatus}
            />
          </div>
          {/* {currentRound ? (
            <>
              {currentRound &&
              currentRound.status === RoundStatus.InProgress ? (
                <Button
                  size="sm"
                  disabled={loading}
                  className="ltr:mr-2 rtl:ml-2 max-w-[150px]"
                  onClick={() => handleRoundActivation(false)}
                >
                  Deactivate Round
                </Button>
              ) : null}
            </>
          ) : (
            <Button
              size="sm"
              color="berrylavender"
              disabled={loading}
              variant="solid"
              className="ltr:mr-2 rtl:ml-2 max-w-[150px]"
              onClick={() => handleRoundActivation(true)}
            >
              Activate Round
            </Button>
          )} */}
        </div>
      )}

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
