import Button from "@/components/ui/Button";
import useAuth from "@/utils/hooks/useAuth";
import { useAccount } from "wagmi";

export const DisconnectButton = () => {
    const { signOut } = useAuth();
    const { isConnected } = useAccount();


    if (!isConnected) {
        return null;
    }

    const handleDisconnect = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error disconnecting:", error);
        }
    };

    return (
        <Button variant="transparent" size="sm" onClick={handleDisconnect}
       >
            Disconnect Wallet
        </Button >
    );
};