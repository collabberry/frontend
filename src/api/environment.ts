import { envionmentGenerator } from "@/utils/environmentGenerator";

export enum Env {
    Production = "production",
    Development = "development"
}

export const envVariables = {
    env: "VITE_NODE_ENV",
    apiUrl: "VITE_APP_BASE_URL",
    teamPointsFactoryAddress: "VITE_APP_TEAM_POINTS_FACTORY_ADDRESS",
    teamPointsFactoryAddressCelo: "VITE_APP_TEAM_POINTS_FACTORY_ADDRESS_CELO",
    appUrl: "VITE_APP_URL",
    network: "VITE_APP_NETWORK",
    blockExplorer: "VITE_APP_BLOCK_EXPLORER"

};

export const environment: typeof envVariables =
    envionmentGenerator(envVariables);
