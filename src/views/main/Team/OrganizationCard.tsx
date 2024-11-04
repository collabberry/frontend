import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { OrgState } from "@/store";
import React from "react";
import { FiEdit, FiRefreshCw } from "react-icons/fi";

interface Organization {
  id: string;
  name: string;
  avatarUrl: string;
}

interface OrganizationCardProps {
  organization: OrgState;
  onEdit: () => void;
  onRefresh: () => void;
  isAdmin: boolean;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onEdit,
  onRefresh,
  isAdmin,
}) => {
  return (
    <div className="flex items-center justify-start">
      <Avatar className="mr-2 rounded-full h-24 w-24" src={organization.logo} />
      <div className="organization-name text-2xl mr-2 text-gray-900">
        {organization.name}
      </div>
      {isAdmin && (
        <Button
          shape="circle"
          size="sm"
          variant="twoTone"
          className="mr-2"
          icon={<FiEdit />}
          onClick={onEdit}
        />
      )}
          <Button
          shape="circle"
          size="sm"
          variant="twoTone"
          icon={<FiRefreshCw />}
          onClick={onRefresh}
        />
    </div>
  );
};

export default OrganizationCard;
