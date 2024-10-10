import CustomTableWithSorting from "@/components/collabberry/custom-components/CustomTableWithSorting";
import { Contributor } from "@/models/Organization.model";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import OrganizationCard from "./OrganizationCard";
import { Avatar, Button, Dialog } from "@/components/ui";
import { placeholderAvatars } from "@/components/collabberry/helpers/Avatars";
import { useLocation } from "react-router-dom";
import EditOrganizationForm from "./EditOrganization";
import AddAgreementForm from "./AddAgreement";
import { set } from "lodash";

const Team: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);

  const location = useLocation();
  const fromDashboard = location.state && location.state.from === "dashboard";

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAgreementDialogOpen, setIsAgreementDialogOpen] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState(
    {} as Contributor
  );

  const viewAgreement = () => {
    // TODO: Logic to view the agreement
  };

  const addAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setSelectedContributor(contributor);
      setIsAgreementDialogOpen(true);
    }
  };

  const columns: ColumnDef<Contributor>[] = [
    {
      header: "Member",
      accessorKey: "username",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;
        const mockAvatar =
          placeholderAvatars[
            Math.floor(Math.random() * placeholderAvatars.length)
          ];
        return (
          <div className="flex flex-row items-center justify-start">
            <Avatar
              className="mr-2 rounded-full"
              src={data.avatar || mockAvatar}
            />
            <span>{value}</span>
          </div>
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
        const agreement = contributor.agreement;
        const mockAvatar =
          placeholderAvatars[
            Math.floor(Math.random() * placeholderAvatars.length)
          ];
        return (
          <div>
            {agreement && Object.keys(agreement).length > 0 ? (
              <Button size="sm" onClick={viewAgreement}>
                View Agreement
              </Button>
            ) : (
              <Button size="sm" onClick={() => addAgreement(contributor)}>
                Add Agreement
              </Button>
            )}
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
        >
          <AddAgreementForm
            contributor={selectedContributor}
            onSubmit={handleAgreementDialogClose}
          />
        </Dialog>
      )}
      <div className="mb-4">
        <div className="text-4xl font-bold ">Organization</div>
      </div>

      <div className="mb-4">
        <OrganizationCard organization={organization} onEdit={handleEdit} />
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
