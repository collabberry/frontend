import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTables/CustomTableWithSorting";
import { Contributor } from "@/models/Organization.model";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setOrganization } from "@/store";
import { useState } from "react";
import OrganizationCard from "./OrganizationCard";
import { Avatar, Button, Dialog } from "@/components/ui";
import { useLocation } from "react-router-dom";
import EditOrganizationForm from "./EditOrganization";
import AddAgreementForm from "./AddAgreement";
import { set } from "lodash";
import ViewAgreement from "./ViewAgreement";
import {
  apiGetContributorAgreement,
  apiGetOrganizationById,
} from "@/services/OrgService";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";

const Team: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const { isAdmin } = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const fromDashboard = location.state && location.state.from === "dashboard";
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAgreementDialogOpen, setIsAgreementDialogOpen] = useState(false);
  const [isViewAgreementDialogOpen, setIsViewAgreementDialogOpen] =
    useState(false);
  const [selectedContributor, setSelectedContributor] = useState(
    {} as Contributor
  );
  // const viewAgreement = async (contributor: Contributor) => {
  //   if (contributor && Object.keys(contributor).length > 0) {
  //     const agreement = await apiGetContributorAgreement(contributor.id);
  //     setSelectedAgreement(agreement);
  //     setIsViewAgreementDialogOpen(true);
  //   }
  // };

  const handleReload = async () => {
    try {
      if (organization.id) {
        const orgResponse = await apiGetOrganizationById(organization.id);
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

  const viewAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      setIsViewAgreementDialogOpen(true);
    }
  };

  const addAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      setIsAgreementDialogOpen(true);
    }
  };

  const handleViewAgreementDialogClose = () => {
    setIsViewAgreementDialogOpen(false);
    setSelectedContributor({} as Contributor);
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
      accessorKey: "agreement.responsibilities",
      id: "agreement",
      cell: (props) => {
        const contributor = props.row.original;
        const agreement = contributor?.agreement;
        return (
          <div>
            {agreement && Object.keys(agreement).length > 0 ? (
              <Button
                size="sm"
                variant="plain"
                onClick={() => viewAgreement(contributor)}
              >
                View Agreement
              </Button>
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

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleAgreementDialogClose = () => {
    setIsAgreementDialogOpen(false);
    setSelectedContributor({} as Contributor);
  };

  return (
    <>
      {isEditDialogOpen && (
        <Dialog isOpen={isEditDialogOpen} onClose={handleCloseDialog}>
          <EditOrganizationForm
            initialData={organization}
            onSubmit={handleCloseDialog}
          />
        </Dialog>
      )}
      {isAgreementDialogOpen && (
        <Dialog
          isOpen={isAgreementDialogOpen}
          onClose={handleAgreementDialogClose}
          width={600}
        >
          <AddAgreementForm
            contributor={selectedContributor}
            handleClose={handleAgreementDialogClose}
          />
        </Dialog>
      )}

      {isViewAgreementDialogOpen && (
        <Dialog
          width={600}
          isOpen={isViewAgreementDialogOpen}
          onClose={handleViewAgreementDialogClose}
        >
          <ViewAgreement
            contributor={selectedContributor}
            handleClose={handleViewAgreementDialogClose}
          />
        </Dialog>
      )}
      <div className="mb-4">
        <h1>Organization</h1>
      </div>

      <div className="mb-4">
        <OrganizationCard
          organization={organization}
          onEdit={handleEdit}
          onReload={handleReload}
          isAdmin={isAdmin as boolean}
        />
      </div>
      <div>
        <CustomTableWithSorting
          data={organization?.contributors || []}
          columns={columns}
          initialSort={
            fromDashboard
              ? [{ id: "agreement", desc: false }]
              : [{ id: "agreement", desc: true }]
          }
        />
      </div>
    </>
  );
};

export default Team;
