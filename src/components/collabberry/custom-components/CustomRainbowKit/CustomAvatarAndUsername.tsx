import React from "react";

interface CustomAvatarAndUsernameProps {
  imageUrl?: string;
  userName?: string;
  displayName?: string;
  userNameBold?: boolean;
}

const CustomAvatarAndUsername: React.FC<CustomAvatarAndUsernameProps> = ({
  imageUrl,
  userName,
  displayName,
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
      {imageUrl && (
        <img
          src={imageUrl}
          alt="User Avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            marginRight: 8,
            objectFit: "cover",
          }}
        />
      )}
      <div className="flex flex-col items-start">
        {userName && (
          <p className={userNameBold ? "font-bold" : ""}>{userName}</p>
        )}
        {displayName && <p>{displayName}</p>}
      </div>
    </div>
  );
};

export default CustomAvatarAndUsername;
