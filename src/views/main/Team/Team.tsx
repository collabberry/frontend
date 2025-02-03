import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { Contributor } from "@/models/Organization.model";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setInvitationToken, setOrganization } from "@/store";
import { useState } from "react";
import OrganizationCard from "./OrganizationCard";
import { Button, Dialog } from "@/components/ui";
import { useLocation } from "react-router-dom";
import EditOrganizationForm from "./EditOrganization";
import AddAgreementForm from "./AddAgreement";
import ViewAgreement from "./ViewAgreement";
import {
  apiGetInvitationToken,
  apiGetOrganizationById,
} from "@/services/OrgService";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import InvitationLink from "../Dashboard/InvitationDialog";
import { useDialog } from "@/services/DialogService";
import { FiEdit, FiEye } from "react-icons/fi";

const Team: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const user = useSelector((state: RootState) => state.auth.user);
  const { isAdmin } = useSelector((state: RootState) => state.auth.user);
  const invitationToken = useSelector(
    (state: RootState) => state.auth.invite.invitationToken
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const { isOpen: isEditDialogOpen, openDialog: openEditDialog, closeDialog: closeEditDialog } = useDialog();
  const { isOpen: isInviteDialogOpen, openDialog: openInviteDialog, closeDialog: closeInviteDialog } = useDialog();
  const { isOpen: isAgreementDialogOpen, openDialog: openAgreementDialog, closeDialog: closeAgreementDialog } = useDialog();
  const { isOpen: isViewAgreementDialogOpen, openDialog: openViewAgreementDialog, closeDialog: closeViewAgreementDialog } = useDialog();
  const { isOpen: isEditAgreementDialogOpen, openDialog: openEditAgreementDialog, closeDialog: closeEditAgreementDialog } = useDialog();
  const fromDashboard = location.state && location.state.from === "dashboard";

  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  ;

  const inviteAction = async () => {
    if (!invitationToken) {
      try {
        const response = await apiGetInvitationToken();
        if (response.data) {
          dispatch(setInvitationToken(response.data));
        }
        openInviteDialog();
      } catch (error: any) {
        handleError(error.response.data.message);
      }
    } else {
      openInviteDialog();
    }
  };


  useEffect(() => {
    const fetchOrganization = async () => {
      const orgId = user?.organization?.id
      try {

        if (orgId) {
          const orgResponse = await apiGetOrganizationById(orgId);
          if (orgResponse.data) {
            dispatch(setOrganization(orgResponse.data));
          }
        } else {
          handleError("Organization ID not found");
        }
      } catch (error: any) {
        handleError(error.response.data.message);
      }
    };
    fetchOrganization();
  }, [])

  const viewAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      openViewAgreementDialog();
    }
  };

  const editAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      openEditAgreementDialog();
    }
  };

  const addAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      openAgreementDialog();
    }
  };


  const columns: ColumnDef<Contributor>[] = [
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
      header: "Commitment",
      accessorKey: "agreement.commitment",
      cell: (props) => {
        const value = props.getValue() as number;
        return value ? <span>{value}%</span> : null;
      },
    },
    {
      header: "Market Rate",
      accessorKey: "agreement.marketRate",
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
    {
      header: "Monetary Compensation",
      accessorKey: "agreement.fiatRequested",
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
    {
      header: "Role Name",
      accessorKey: "agreement.roleName",
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
      header: "Agreement",
      accessorKey: "agreement",
      id: "agreement",
      sortingFn: (rowA, rowB, columnId) => {
        const agreementA = rowA.original.agreement;
        const agreementB = rowB.original.agreement;
        const isEmptyA = !agreementA || Object.keys(agreementA).length === 0;
        const isEmptyB = !agreementB || Object.keys(agreementB).length === 0;
        return isEmptyA === isEmptyB ? 0 : isEmptyA ? -1 : 1;
      },
      cell: (props) => {
        const contributor = props.row.original;
        const agreement = contributor?.agreement;
        return (
          <div>
            {agreement && Object.keys(agreement).length > 0 ? (
              <div className="grid xl:grid-cols-2 gap-2 grid-cols-1">
                <Button
                  size="sm"
                  icon={<FiEye />}
                  onClick={() => viewAgreement(contributor)}
                >
                  View
                </Button>
                {
                  isAdmin && (
                    <Button
                      size="sm"
                      icon={<FiEdit />}
                      onClick={() => editAgreement(contributor)}
                    >
                      Edit
                    </Button>
                  )
                }
              </div>


            ) : isAdmin ? (
              <Button size="sm" onClick={() => addAgreement(contributor)}>
                Add Agreement
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];






  return (
    <>
      {isEditDialogOpen && (
        <Dialog isOpen={isEditDialogOpen} onClose={closeEditDialog}>
          <EditOrganizationForm
            initialData={organization}
            onSubmit={closeEditDialog}
          />
        </Dialog>
      )}
      {isInviteDialogOpen && (
        <Dialog isOpen={isInviteDialogOpen} onClose={closeInviteDialog}>
          <InvitationLink invitationToken={invitationToken} />
        </Dialog>
      )}
      {isAgreementDialogOpen && (
        <Dialog
          isOpen={isAgreementDialogOpen}
          onClose={closeAgreementDialog}
          width={600}
        >
          <AddAgreementForm
            contributor={selectedContributor}
            handleClose={closeAgreementDialog}
          />
        </Dialog>
      )}

      {isEditAgreementDialogOpen && (
        <Dialog
          isOpen={isEditAgreementDialogOpen}
          onClose={closeEditAgreementDialog}
          width={600}
        >
          <AddAgreementForm
            contributor={selectedContributor}
            handleClose={closeEditAgreementDialog}
          />
        </Dialog>
      )}

      {isViewAgreementDialogOpen && (
        <Dialog
          width={600}
          isOpen={isViewAgreementDialogOpen}
          onClose={closeViewAgreementDialog}
        >
          <ViewAgreement
            contributor={selectedContributor}
            handleClose={closeViewAgreementDialog}
          />
        </Dialog>
      )}
      <div className="mb-4">
        <h1>Team</h1>
      </div>

      <div className="mb-4">
        <OrganizationCard
          organization={organization}
          onEdit={openEditDialog}
          onInvite={inviteAction}
          isAdmin={isAdmin as boolean}
        />
      </div>
      <div>
        <CustomTableWithSorting
          data={organization?.contributors || []}
          columns={columns}
          initialSort={
            fromDashboard
              ? [{ id: "agreement", desc: false, }]
              : [{ id: "agreement", desc: true }]
          }
        />
      </div>
    </>
  );
};

export default Team;
