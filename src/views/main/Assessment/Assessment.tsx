import Card from "@/components/ui/Card";
import {
  apiCreateOrganization,
  apiGetOrganizationById,
  apiEditOrganization,
  apiGetInvitationToken,
  apiGetContributorAgreement,
  apiCreateContributorAgreement,
} from "@/services/OrgService";
import ContributorSelectList from "./ContributorSelectList";
import CustomSelectTable from "@/components/collabberry/custom-components/CustomSelectTable";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { Contributor } from "@/models/Organization.model";
import { Avatar } from "@/components/ui";

const Assessment = () => {
  const organization = useSelector((state: RootState) => state.auth.org);

  const columns: ColumnDef<Contributor>[] = [
    {
      header: "Member",
      accessorKey: "username",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;
        return (
          <div className="flex flex-row items-center justify-start">
            <Avatar className="mr-2 rounded-full" src={data.profilePicture} />
            <span>{value}</span>
          </div>
        );
      },
    },
    {
      header: "Role",
      accessorKey: "agreement.roleName",
    },
  ];

  return (
    <>
      <div>
        <h1>Assessment</h1>
        <p> </p>
        Manage assessment data here.
        {/* Add more content about your team here */}
      </div>
      {/* <div>
        <ContributorSelectList></ContributorSelectList>
      </div> */}
      <CustomSelectTable
        data={organization?.contributors || []}
        columns={columns}
      />
    </>
  );
};

export default Assessment;
