import { abi as teamPointsFactoryAbi } from '../abi/TeamPointsFactory.json';
import { abi as teamPointsAbi } from '../abi/TeamPoints.json';
import { useEthersSigner } from '@/utils/hooks/useEthersSigner';
import { ethers, EventLog } from 'ethers';
import { useAccount } from 'wagmi';

function generateSymbol(orgName: string): string {
    let symbol = orgName.replace(/[aeiou\s]/gi, '').toUpperCase();
    const extraConsonants = ['X', 'Y', 'Z'];

    const generateRandomConsonant = () => {
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        return consonants[Math.floor(Math.random() * consonants.length)];
    };
    const neededLength = 3;
    const missingCount = Math.max(0, neededLength - symbol.length);

    let additionalConsonants;
    if (symbol.length === 0) {
        additionalConsonants = [...Array(missingCount)].map(generateRandomConsonant);
    } else {
        additionalConsonants = [...Array(missingCount)].map(() => {
            return extraConsonants[Math.floor(Math.random() * extraConsonants.length)];
        });
    }
    symbol = symbol.concat(additionalConsonants.join(''));

    return symbol;
}

const getEvent = (logs: any, eventName: string): EventLog => {
    return logs
        .filter((e: any) => e instanceof EventLog)
        .find((e: EventLog) => e.eventName === eventName);
};

const DEFAULT_ERROR_MESSAGE = 'Transaction failed! Please try again.';
export enum ContractResponseStatus {
    Success = 'success',
    Failed = 'failed',
}

interface ContractResponse {
    data?: any;
    event?: EventLog;
    message: string;
    status: ContractResponseStatus;
}

const _deployTeamPoints = async (ethersSigner: ethers.JsonRpcSigner | undefined, orgName: string): Promise<ContractResponse> => {
    try {
        const factoryAddress = '0x0e414560fdEeC039c4636b9392176ddc938b182D'
        // const factoryAddress = import.meta.env.VITE_APP_TEAM_POINTS_FACTORY_ADDRESS;
        const symbol = generateSymbol(orgName);
        const trimmedOrgName = orgName.trim();
        const contract = new ethers.Contract(factoryAddress, teamPointsFactoryAbi, ethersSigner);
        const res = await contract.deployTeamPoints(trimmedOrgName + "TP", symbol);
        const tx = await res.wait();
        const event = getEvent(tx.logs, 'TeamPointsCreated');
        if (!event) {
            return {
                message: DEFAULT_ERROR_MESSAGE,
                status: ContractResponseStatus.Failed,
            }
        }
        return {
            data: {
                contractAddress: event.args.contractAddress,
                initialOwner: event.args.initialOwner,
                name: event.args.name,
                symbol: event.args.symbol,
            },
            event,
            message: 'Success',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        console.error(error);
    }
    return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
    };
};

const _readSettings = async (contractAddress: string, ethersSigner: ethers.JsonRpcSigner | undefined): Promise<ContractResponse> => {
    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const [isTransferable, isOutsideTransferAllowed, materialWeight] = await Promise.all([
            contract.isTransferable(),
            contract.isOutsideTransferAllowed(),
            contract.materialContributionWeight()
        ]);
        return {
            data: { isTransferable, isOutsideTransferAllowed, materialWeight },
            message: 'Success',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        console.error(error);
    }
    return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
    };
};

const _updateSettings = async (
    contractAddress: string,
    isTransferable: boolean,
    isOutsideTransferAllowed: boolean,
    materialWeight: BigInt,
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const tx = await contract.updateSettings(isTransferable, isOutsideTransferAllowed, materialWeight);
        const receipt = await tx.wait();
        // Extract the event from the transaction logs
        const event = getEvent(receipt.logs, 'SettingsUpdated');
        if (!event) {
            return {
                message: DEFAULT_ERROR_MESSAGE,
                status: ContractResponseStatus.Failed,
            };
        }

        return {
            data: {
                isTransferable: event.args.isTransferable,
                isOutsideTransferAllowed: event.args.isOutsideTransferAllowed,
                materialWeight: event.args.materialWeight,
            },
            event,
            message: 'Settings updated successfully',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        console.error('Error updating settings:', error);
    }
    return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
    };
};

const _batchMint = async (
    contractAddress: string,
    recipients: string[],
    materialContributions: number[],
    timeContributions: number[],
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const tx = await contract.batchMint(recipients, materialContributions, timeContributions);
        const receipt = await tx.wait();
        return {
            message: 'Batch minting successful',
            status: ContractResponseStatus.Success,
            data: {
                transactionHash: receipt.hash,
            }
        };
    } catch (error) {
        console.error(error);
    }
    return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
    };
};

export const useDeployTeamPoints = () => {
    const { address } = useAccount();
    const ethersSigner = useEthersSigner();


    const deployTeamPoints = async (orgName: string): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _deployTeamPoints(ethersSigner, orgName);
    };

    const readSettings = async (contractAddress: string): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _readSettings(contractAddress, ethersSigner);
    };

    const updateSettings = async (
        contractAddress: string,
        isTransferable: boolean,
        isOutsideTransferAllowed: boolean,
        materialWeight: BigInt
    ): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _updateSettings(contractAddress, isTransferable, isOutsideTransferAllowed, materialWeight, ethersSigner);
    };

    const batchMint = async (
        contractAddress: string,
        recipients: string[],
        materialContributions: number[],
        timeContributions: number[]
    ): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        if (
            recipients.length !== materialContributions.length ||
            recipients.length !== timeContributions.length
        ) {
            return {
                message: 'Input arrays must have the same length.',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _batchMint(contractAddress, recipients, materialContributions, timeContributions, ethersSigner);
    };




    return {
        deployTeamPoints,
        readSettings,
        updateSettings,
        batchMint,
        ethersSigner,
    };
}