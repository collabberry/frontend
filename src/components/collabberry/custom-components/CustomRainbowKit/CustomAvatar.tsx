import { RootState } from "@/store";
import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { useSelector } from "react-redux";

const CustomAvatar: any = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { profilePicture, userName } = user;
  const size = 70;
  return profilePicture ? (
    <img
      src={profilePicture}
      
      className="rounded-full object-cover h-20 w-20"
    />
  ) : (
    <div
      style={{
        borderRadius: 999,
        height: size,
        width: size,
        fontSize: "55px",
      }}
    >
      🙂
    </div>
  );
};

export default CustomAvatar;
