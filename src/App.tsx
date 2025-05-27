import Theme from "@/components/template/Theme";
import Layout from "@/components/layouts";
import mockServer from "./mock";
import appConfig from "@/configs/app.config";
import "./locales";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { getAccount } from "wagmi/actions";
import useAuth from "./utils/hooks/useAuth";
import { useEffect, useMemo } from "react";
import { mainnet, polygon, optimism, arbitrum, base, arbitrumSepolia, celo, celoAlfajores } from "wagmi/chains";
import { useAppSelector } from "./store";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomAvatar from "./components/collabberry/custom-components/CustomRainbowKit/CustomAvatar";
import { Env, environment } from "./api/environment";



export const config = getDefaultConfig({
  appName: "Collabberry",
  projectId: "dd33813752fd2f608af1325845cc6abc",
  // syncConnectedChain: true,
  chains: environment?.env === Env.Production ? [arbitrum, celo] : [arbitrumSepolia, celo],
  // ssr: true, // If your dApp uses server side rendering (SSR)
});

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
// if (environment !== "production" && appConfig.enableMock) {
//   mockServer({ environment });
// }

const base_url = environment?.apiUrl;

function App() {
  const { signInWithWallet } = useAuth();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const state = useAppSelector((state) => state);


  const avatarProps = useMemo(() => {
    const { profilePicture, userName } = user;
    return { ensImage: profilePicture, size: 50 };
  }, [user]);
  const [searchParams, setSearchParams] = useSearchParams();
  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);
  const { status } = useAppSelector((state) => state.auth.session);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const { address } = getAccount(config);
        const response = await fetch(`${base_url}/api/users/auth/nonce`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address }),
        });
        const responseBody = await response.json();
        return responseBody?.nonce;
      },
      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.host,
          address,
          statement: nonce,
          uri: window.location.origin,
          version: "1",
          chainId,
        });
      },
      getMessageBody: ({ message }) => {
        return message.prepareMessage();
      },
      verify: async ({ message, signature }) => {
        let isSuccess = false;
        try {
          const verifyRes = await fetch(`${base_url}/api/users/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signature, message }),
          });
          const { token } = await verifyRes.json();
          const result = await signInWithWallet(token);
          if (result?.status === "success") {
            isSuccess = true;
          } else {
            const url = invitationToken
              ? `${appConfig.memberSignUpPath}?invitationToken=${invitationToken}`
              : appConfig.notRegisteredEntryPath;
            navigate(url);
          }
        } catch (error) {
          console.error("Error verifying signature", error);
          return isSuccess;
        }
        return isSuccess;
      },
      signOut: async () => {},
    });
  }, []);

  //TODO: Enable this for debugging
  
  // useEffect(() => {
  //   console.log(" state changed:", state);
  // }, [state]);

  return (
    <RainbowKitAuthenticationProvider
      adapter={authenticationAdapter}
      status={status}
    >
      <RainbowKitProvider
        appInfo={{
          appName: "Collabberry",
          learnMoreUrl: environment?.appUrl
        }}
        avatar={CustomAvatar}
      >
        <Theme>
          <Layout />
        </Theme>
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
}

export default App;
