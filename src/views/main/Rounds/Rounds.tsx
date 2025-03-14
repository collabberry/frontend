import RoundStatusTag from "@/components/collabberry/custom-components/CustomFields/RoundStatusTag";
import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { Button, Dialog, Tooltip } from "@/components/ui";
import { useDialog } from "@/services/DialogService";
import {
  apiGetRoundById,
} from "@/services/OrgService";
import {
  RootState,
  setSelectedRound,
} from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { FiEdit, FiList } from "react-icons/fi";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditRoundForm from "./EditRoundForm";
import { refreshAllRounds } from "@/services/LoadAndDispatchService";
import { useHandleError } from "@/services/HandleError";

const Rounds: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleError = useHandleError();
  const { isAdmin } = useSelector((state: RootState) => state.auth.user);
  const { allRounds, selectedRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );
  const { isOpen: isEditRoundDialogOpen, openDialog: openEditRoundDialog, closeDialog: closeEditRoundDialog } = useDialog();

  React.useEffect(() => {
    refreshAllRounds(dispatch, handleError);
  }, [dispatch]);

  const goToRound = async (round: any) => {
    try {
      const selRound = await apiGetRoundById(round.id);
      if (selRound?.data) {
        dispatch(setSelectedRound(selRound.data));
        navigate("round");
      }
    } catch (error: any) {
      handleError(error);
    }
  };



  const columns: ColumnDef<any>[] = [
    {
      header: "Round",
      accessorKey: "roundNumber",
      cell: (props) => {
        const value = props.getValue() as string;
        return <span>{`Round ${value}`}</span>;
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
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
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
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
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
      header: "Action",
      id: "round",
      cell: (props) => {
        const round = props.row.original;
        return (
          <div>
            {round?.id ? (
              <div className="flex gap-2">

                <Tooltip title="Go To Round">
                  <Button
                    size="sm"
                    shape="circle"
                    icon={<FiList />}
                    onClick={() => goToRound(round)}
                  >
                  </Button>
                </Tooltip>
                {isAdmin && (round.status === RoundStatus.InProgress || round.status === RoundStatus.NotStarted) && (
                  <Tooltip title="Edit Round">
                    <Button
                      size="sm"
                      shape="circle"
                      icon={<FiEdit />}
                      onClick={() => editRound(round)}
                    >
                    </Button>
                  </Tooltip>

                )}
              </div>
            ) : null}
          </div>
        );
      },
    },
  ];

  const editRound = async (round: any) => {
    try {
      const selRound = await apiGetRoundById(round.id);
      if (selRound?.data) {
        dispatch(setSelectedRound(selRound.data));
        openEditRoundDialog();
      }
    } catch (error: any) {
      handleError(error);
    }

  }

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <h1>Rounds</h1>
      </div>
      {
        isEditRoundDialogOpen && (
          <Dialog
            isOpen={isEditRoundDialogOpen}
            onClose={closeEditRoundDialog}
            width={600}
          >
            <EditRoundForm handleClose={closeEditRoundDialog} round={selectedRound} />
          </Dialog>
        )
      }

      <div className="mt-4">
        {allRounds.length ? (
          <>
            {/* {
              loading ? (<>
                <Skeleton height={40} />
                <Skeleton height={67} className="mt-2" />
              </>) : ()
            } */}
            <CustomTableWithSorting
              data={allRounds || []}
              columns={columns}
              initialSort={[{ id: "roundNumber", desc: true }]}
            />

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
