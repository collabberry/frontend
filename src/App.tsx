import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
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
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { getAccount } from "wagmi/actions";

const environment = process.env.NODE_ENV;

const config = getDefaultConfig({
  appName: "Collabberry",
  projectId: "dd33813752fd2f608af1325845cc6abc",
  chains: [mainnet, polygon, optimism, arbitrum, base],
  // ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (environment !== "production" && appConfig.enableMock) {
  mockServer({ environment });
}

const base_url = "http://16.171.142.20";
const authenticationAdapter = createAuthenticationAdapter({
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
      //   statement: "dedcd15d-f79a-46aa-a220-53c435f13997",
      uri: window.location.origin,
      version: "1",
      chainId,
    });
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    console.log("message verify", message);
    const verifyRes = await fetch(`${base_url}/api/users/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature, walletAddress: message.address }),
      //   body: JSON.stringify({ signature: '0xb2156e0a64981677e5d8677629ef5e909f6cb92fb042993dfd09c4115d3697d220447b9fc73f9f87f293b5884c2f40db7df2198fcc5332ce29e635de930691bd1b', walletAddress: message.address }),
    });
    return Boolean(verifyRes.ok);
  },
  signOut: async () => {},
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitAuthenticationProvider
              adapter={authenticationAdapter}
              status="unauthenticated"
            >
              <RainbowKitProvider>
                <BrowserRouter>
                  <Theme>
                    <Layout />
                  </Theme>
                </BrowserRouter>
              </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
