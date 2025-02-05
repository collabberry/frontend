import React from "react";
import placeholderIcon from '@/assets/images/placeholder.jpg';
import Tag from "@/components/ui/Tag";


interface CustomAvatarAndUsernameProps {
  imageUrl?: string;
  isContractAdmin?: boolean;
  userName?: string;
  avatarSize?: number;
  displayName?: string;
  userNameBold?: boolean;
}

const CustomAvatarAndUsername: React.FC<CustomAvatarAndUsernameProps> = ({
  imageUrl,
  userName,
  displayName,
  isContractAdmin,
  avatarSize = 40,
  userNameBold = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <img
        src={imageUrl ?? placeholderIcon}
        alt="User Avatar"
        style={{
          width: avatarSize,
          height: avatarSize,
          minWidth: avatarSize,
          borderRadius: "50%",
          marginRight: 8,
          objectFit: "cover",
        }}
      />

      <div className="flex flex-col items-start">
        {userName && (
          <div className="flex items-center">
            <p className={userNameBold ? "font-bold" : ""}>{userName}</p>
            {/* {isContractAdmin && <Tag className="bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-100 rounded-md border-0 p-1 ml-1">
              <span>
                Admin
              </span>
            </Tag>} */}
          </div>
        )}
        {displayName && <p>{displayName}</p>}

      </div>
    </div>
  );
};

export default CustomAvatarAndUsername;
