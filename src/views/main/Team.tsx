import CustomTableWithSorting from "@/components/collabberry/ui-components/CustomTableWithSorting";
import { Contributor } from "@/models/Organization.model";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Team: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);

  const contributorsWithAgreements = organization?.contributors?.filter(
    (contributor: Contributor) =>
      contributor.agreement && Object.keys(contributor.agreement).length > 0
  );
  const columns: ColumnDef<Contributor>[] = [
    {
      header: "Team Member",
      accessorKey: "username",
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
      cell: (props) => (
        <span>
          $
          {Number(props.getValue() as number).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    },
    {
      header: "Monetary Compensation",
      accessorKey: "agreement.fiatRequested",
      cell: (props) => (
        <span>
          $
          {Number(props.getValue() as number).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      ),
    },
    {
      header: "Role Name",
      accessorKey: "agreement.roleName",
    },
    // {
    //   header: "Team Points",
    //   accessorKey: "agreement.teamPoints",
    // },
    {
      header: "Team Points Share",
      accessorKey: "agreement.teamPointsShare",
      cell: (props) => {
        const value = props.getValue() as number;
        return value ? <span>{value}%</span> : null;
      },
    },
  ];

  return (
    <>
      <div>
        <h1>Our Team</h1>
        <p>Meet the amazing team behind our success.</p>
        {/* Add more content about your team here */}
      </div>
      <div>
        <CustomTableWithSorting
          data={contributorsWithAgreements || []}
          columns={columns}
        />
      </div>
    </>
  );
};

export default Team;
