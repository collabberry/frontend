import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { OrgState } from "@/store";
import React from "react";
import { FiEdit } from "react-icons/fi";

interface Organization {
  id: string;
  name: string;
  avatarUrl: string;
}

interface OrganizationCardProps {
  organization: OrgState;
  onEdit: () => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-start">
      <Avatar className="mr-2 rounded-full h-24 w-24" src={organization.logo} />
      <div className="organization-name text-2xl mr-2">{organization.name}</div>
      <Button
        shape="circle"
        size="sm"
        variant="twoTone"
        icon={<FiEdit />}
        onClick={onEdit}
      />
    </div>
  );
};

export default OrganizationCard;
