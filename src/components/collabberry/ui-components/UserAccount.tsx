import React from "react";
import { CustomConnectButton } from "../CustomConnectButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface UserAccountProps {}

const UserAccount: React.FC<UserAccountProps> = ({}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { avatar, email, userName } = user;

  const mockAvatar = "https://avatar.iran.liara.run/public/59";

  return <CustomConnectButton userName={userName} imageUrl={mockAvatar} />;
};

export default UserAccount;
