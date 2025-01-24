import React from "react";
import placeholderIcon from '@/assets/images/placeholder.jpg';

interface CustomPlaceholderAvatarAndUsernameProps {
    name?: string;
    avatarSize?: number;
}

const PlaceholderAvatarAndUsername: React.FC<CustomPlaceholderAvatarAndUsernameProps> = ({
    name = 'User',
    avatarSize = 40,
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
               src={placeholderIcon}
                alt="User Avatar Placeholder"
                style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: "50%",
                    marginRight: 8,
                    objectFit: "cover",
                }}
            />
            <div className="flex flex-col items-start">
                {name && (
                    <p>{name}</p>
                )}
            </div>
        </div>
    );
};

export default PlaceholderAvatarAndUsername;
