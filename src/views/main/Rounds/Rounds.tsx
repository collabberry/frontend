import { Assessment } from "@/@types/auth";
import RoundStatusTag from "@/components/collabberry/custom-components/CustomFields/RoundStatusTag";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { Alert, Button, Switcher } from "@/components/ui";
import {
  apiActivateRounds,
  apiAddAssessment,
  apiGetCurrentRound,
  apiGetOrganizationById,
  apiGetRoundById,
  apiGetRounds,
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
import { FiRefreshCw } from "react-icons/fi";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Rounds: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const organization = useSelector((state: RootState) => state.auth.org);
  const { isAdmin } = useSelector((state: RootState) => state.auth.user);
  const { allRounds, currentRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );

  // React.useEffect(() => {
  //   const initializeRounds = async () => {
  //     await fetchAllRounds();
  //     await fetchCurrentRound();
  //   };

  //   initializeRounds();
  // }, []);

  const fetchAllRounds = async () => {
    setLoading(true);
    try {
      const allRoundsResponse = await apiGetRounds();
      if (allRoundsResponse?.data) {
        dispatch(setAllRounds(allRoundsResponse.data));
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentRound = async () => {
    setLoading(true);
    try {
      const currentRoundResponse = await apiGetCurrentRound();
      if (currentRoundResponse?.data) {
        dispatch(setRounds(currentRoundResponse.data));
      } else {
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const getRoundNumber = (id: string) => {
    if (!id) return "";
    const index = allRounds?.findIndex((r) => r.id === id);
    return allRounds?.length - index;
  };
  const isCurrentRound = (round: any) => {
    return round?.id === currentRound?.id;
  };

  const handleReload = async () => {
    try {
      const allRoundsResponse = await apiGetRounds();
      if (allRoundsResponse.data) {
        dispatch(setAllRounds(allRoundsResponse.data));
      }
    } catch (error: any) {
      handleError(error.response.data.message);
    }

    try {
      const roundResponse = await apiGetCurrentRound();
      if (roundResponse.data) {
        dispatch(setRounds(roundResponse.data));
      }
    } catch (error: any) {
      handleError(error.response.data.message);
    }
  };
  // const handleRoundActivation = async (event: boolean) => {
  //   setLoading(true);
  //   try {
  //     const response = await apiActivateRounds({
  //       isActive: event,
  //     });
  //     if (organization?.id) {
  //       try {
  //         const roundResponse = await apiGetCurrentRound();
  //         if (roundResponse?.data) {
  //           dispatch(setRounds(roundResponse.data));
  //         }
  //       } catch (error: any) {
  //         setLoading(false);
  //         handleError(error.response.data.message);
  //       }

  //       try {
  //         const allRoundsResponse = await apiGetAllRounds();
  //         if (allRoundsResponse?.data) {
  //           dispatch(setAllRounds(allRoundsResponse.data));
  //         }
  //       } catch (error: any) {
  //         setLoading(false);
  //         handleError(error.response.data.message);
  //       }
  //       try {
  //         const orgResponse = await apiGetOrganizationById(organization.id);
  //         if (orgResponse?.data) {
  //           dispatch(setOrganization(orgResponse.data));
  //         }
  //       } catch (error: any) {
  //         setLoading(false);
  //         handleError(error.response.data.message);
  //       }
  //     }
  //     setRoundsStatus(event);
  //     setLoading(false);
  //   } catch (error: any) {
  //     setLoading(false);
  //     handleError(error.response.data.message);
  //   }
  // };

  const goToRound = async (round: any) => {
    try {
      const selRound = await apiGetRoundById(round.id);
      if (selRound?.data) {
        dispatch(setSelectedRound(selRound.data));
        navigate("round");
      }
    } catch (error: any) {
      handleError(error.response.data.message);
    }
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
          timeZone: "UTC",
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
    {
      header: "Go to Round",
      id: "round",
      cell: (props) => {
        const round = props.row.original;
        return (
          <div>
            {round?.id ? (
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
      <div className="flex flex-row gap-2 items-center">
        <h1>Rounds</h1>
        <Button
          shape="circle"
          size="xs"
          variant="twoTone"
          icon={<FiRefreshCw />}
          onClick={handleReload}
        />
      </div>

      <div className="mt-4">
        {allRounds.length ? (
          <>
            {/* {isAdmin && (
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
              </div>
            )} */}
            <CustomTableWithSorting data={allRounds || []} columns={columns} />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Rounds;
