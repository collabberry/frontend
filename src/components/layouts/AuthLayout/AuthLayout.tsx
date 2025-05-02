import Side from "./Side";
// import Cover from './Cover'
// import Simple from './Simple'
import View from "@/views";
import { useAppSelector } from "@/store";
import { LAYOUT_TYPE_BLANK } from "@/constants/theme.constant";
import Header from "@/components/template/Header";
import CollabberyLogoFull from "@/assets/svg/CollabberryLogoFull";
import { SvgIcon } from "@/components/shared";
import { DisconnectButton } from "@/components/collabberry/custom-components/CustomRainbowKit/UserDisconnect";

const AuthHeaderActionEnd = () => {
  return (
    <>
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
        headerStart={<CollabberyLogoFull  />}
        headerEnd={<AuthHeaderActionEnd />}
      />
      <div className="container mx-auto flex flex-1 items-center flex-col justify-center">
        <View />
      </div>
    </div>
  );
};

export default AuthLayout;
