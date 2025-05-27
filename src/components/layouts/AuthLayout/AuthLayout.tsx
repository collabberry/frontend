
import View from "@/views";
import { useAppSelector } from "@/store";
import Header from "@/components/template/Header";
import CollabberyLogoFull from "@/assets/svg/CollabberryLogoFull";
import { DisconnectButton } from "@/components/collabberry/custom-components/CustomRainbowKit/UserDisconnect";
import { CustomWrongNetworkButton } from "@/components/collabberry/custom-components/CustomRainbowKit/CustomWrongNetworkButton";

const AuthHeaderActionEnd = () => {
  return (
    <>
      <CustomWrongNetworkButton />
      <DisconnectButton />
    </>
  );
};

const AuthLayout = () => {
  const layoutType = useAppSelector((state) => state.theme.layout.type);

  return (
    <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
      <Header
        className="bg-transparent backdrop-blur-md shadow-none"
        headerStart={<CollabberyLogoFull />}
        headerEnd={<AuthHeaderActionEnd />}
      />
      <div className="container mx-auto flex flex-1 items-center flex-col justify-center">
        <View />
      </div>
    </div>
  );
};

export default AuthLayout;
