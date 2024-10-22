import React from "react";
import { CustomConnectButton } from "./CustomConnectButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface UserAccountProps {}

const UserAccount: React.FC<UserAccountProps> = ({}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { profilePicture, email, userName } = user;

  return <CustomConnectButton userName={userName} imageUrl={profilePicture} />;
};

export default UserAccount;
