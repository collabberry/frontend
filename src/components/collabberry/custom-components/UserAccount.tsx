import React from "react";
import { CustomConnectButton } from "./CustomConnectButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { placeholderAvatars } from "../helpers/Avatars";

interface UserAccountProps {}

const UserAccount: React.FC<UserAccountProps> = ({}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { profilePicture, email, userName } = user;
  console.log("User: ", user);

  return <CustomConnectButton userName={userName} imageUrl={profilePicture} />;
};

export default UserAccount;
