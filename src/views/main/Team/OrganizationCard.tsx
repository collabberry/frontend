import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { OrgState } from "@/store";
import React from "react";
import { FiActivity, FiEdit, FiExternalLink, FiUserPlus, FiUsers } from "react-icons/fi";
import orgPlaceholderIcon from '@/assets/images/placeholder-team.jpg';
import { Tooltip } from "@/components/ui";


interface Organization {
  id: string;
  name: string;
  avatarUrl: string;
}

interface OrganizationCardProps {
  organization: OrgState;
  onEdit: () => void;
  onInvite: () => void;
  isAdmin: boolean;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onEdit,
  onInvite,
  isAdmin,
}) => {
  return (
    <div className="flex items-center justify-start">
      {
        organization?.logo ? (
          <Avatar className="mr-2 rounded-full h-24 w-24" src={organization.logo} />
        ) : (
          <Avatar
            src={orgPlaceholderIcon}
            alt={organization.name}
            className="mr-2 rounded-full h-24 w-24"
          />
        )
      }
     
     <div className="flex flex-col gap-2">
     <div className="organization-name text-2xl mr-2 text-gray-900">
            {organization.name}
          </div>
          {isAdmin && (
            <div className="flex flex-row"> 
            
              <Tooltip title="Edit Organization">
                <Button
                  shape="circle"
                  size="sm"
                  variant="solid"
                  className="mr-2"
                  icon={<FiEdit />}
                  onClick={onEdit}
                />
              </Tooltip>
              <Tooltip title="Invite Members">
                <Button
                  shape="circle"
                  size="sm"
                  variant="solid"
                  className="mr-2"
                  icon={<FiUserPlus />}
                  onClick={onInvite}
                />
              </Tooltip>

            </div>
          )}
     </div>
        
    

    </div>
  );
};

export default OrganizationCard;
