import { useMemo } from "react";
import { useAccount, useChainId, useConfig } from "wagmi";
import {
    arbitrum,
    arbitrumSepolia,
    celo,
} from "viem/chains";
import { Env, environment } from "@/api/environment";


const SUPPORTED_CHAINS =
    environment?.env === Env.Production ? [arbitrum, celo] : [arbitrumSepolia, celo]


export function useChainService() {
    const chainId = useChainId();
    const chain = useMemo(
        () =>
            SUPPORTED_CHAINS.find((c) => c.id === chainId) ?? null,
        [chainId],
    );

    const blockExplorer = useMemo(() => {
        if (chain?.blockExplorers?.default) {
            return chain.blockExplorers.default.url;
        }
        return "";
    }, [chain]);

    const isLoading = chainId === undefined;
    const chainError =
        !isLoading && chain === null
            ? new Error(`Unsupported chain: ${chainId}`)
            : undefined;
    return {
        chain,
        chains: SUPPORTED_CHAINS,
        network: chain?.name || "Unknown",
        blockExplorer,
        isLoading,
        chainError,
    };
}