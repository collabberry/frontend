import { ConnectButton } from "@rainbow-me/rainbowkit";

interface CustomConnectButtonProps {
  disabled?: boolean;
  imageUrl?: string;
  signInMode?: boolean;
  userName?: string;
}
export const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({
  disabled = false,
  signInMode = false,
  imageUrl,
  userName,
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className={`${
                      disabled
                        ? "bg-berrylavender-500 text-berrylavender-700 cursor-not-allowed"
                        : "bg-berrylavender-400 hover:bg-berrylavender-700 text-offWhite"
                    } font-bold py-2 px-4 rounded`}
                    disabled={disabled}
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              if (connected && !signInMode) {
                return (
                  <div style={{ display: "flex", gap: 12 }}>
                    {/* <button
                      onClick={openChainModal}
                      style={{ display: "flex", alignItems: "center" }}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button> */}
                    <div onClick={openAccountModal} className="cursor-pointer ">
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
                            }}
                          />
                        )}
                        <div className="flex flex-col items-start">
                          {userName && <p className="font-bold">{userName}</p>}
                          <p>{account.displayName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
