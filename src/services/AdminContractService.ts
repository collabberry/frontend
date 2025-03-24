import { abi as teamPointsAbi } from '../abi/TeamPoints.json';
import { useEthersSigner } from '@/utils/hooks/useEthersSigner';
import { ethers, EventLog } from 'ethers';
import { useAccount } from 'wagmi';
import { ContractResponse, } from './ContractsService';
import { Contributor } from '@/models/Organization.model';
import { ContractResponseStatus, parseErrorMessage } from '@/utils/parseErrorMessage';


const _checkAdminContributors = async (
    contractAddress: string,
    contributors: Contributor[],
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    if (!ethersSigner) {
        return {
            message: 'Signer is not available',
            status: ContractResponseStatus.Failed,
        };
    }

    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const contributorsStatusAndBalance = await Promise.all(
            contributors.map(async (contributor) => {
                const isAdmin = await contract.isAdmin(contributor.walletAddress);
                const balance = await contract.balanceOf(contributor.walletAddress);
                return {
                    ...contributor,
                    isAdmin,
                    balance: balance.toString(),
                };
            })
        );

        const adminContributors = contributorsStatusAndBalance
            .filter(({ isAdmin }) => isAdmin)
            .map(contributor => contributor);


        return {
            data: { contributorsStatusAndBalance, adminContributors },
            message: 'Admin contributors checked successfully',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        console.error('Error checking admin contributors:', error);
        return {
            message: parseErrorMessage(error),
            status: ContractResponseStatus.Failed,
        };
    }
};

const _checkIsAdmin = async (
    contractAddress: string,
    contributorAddress: string,
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    if (!ethersSigner) {
        return {
            message: 'Signer is not available',
            status: ContractResponseStatus.Failed,
        };
    }

    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const isAdmin = await contract.isAdmin(contributorAddress);

        return {
            data: { isAdmin },
            message: 'Admin status checked successfully',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        console.error('Error checking admin status:', error);
        return {
            message: parseErrorMessage(error),
            status: ContractResponseStatus.Failed,
        };
    }
};

const _addAdmin = async (
    contractAddress: string,
    newAdminAddress: string,
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    if (!ethersSigner) {
        return {
            message: 'Signer is not available',
            status: ContractResponseStatus.Failed,
        };
    }

    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const tx = await contract.addAdmin(newAdminAddress);
        await tx.wait(); // Wait for the transaction to be mined

        return {
            message: 'Admin added successfully',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        return {
            message: parseErrorMessage(error),
            status: ContractResponseStatus.Failed,
        };
    }
};


const _removeAdmin = async (
    contractAddress: string,
    adminAddressToRemove: string,
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    if (!ethersSigner) {
        return {
            message: 'Signer is not available',
            status: ContractResponseStatus.Failed,
        };
    }

    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const tx = await contract.removeAdmin(adminAddressToRemove);
        await tx.wait();
        return {
            message: 'Admin removed successfully',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        return {
            message: parseErrorMessage(error),
            status: ContractResponseStatus.Failed,
        };
    }
};

export const useAdminContractService = () => {
    const { address } = useAccount();
    const ethersSigner = useEthersSigner();

    const checkAdminContributors = async (contractAddress: string, contributors: Contributor[]): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _checkAdminContributors(contractAddress, contributors, ethersSigner);
    };

    const checkIsAdmin = async (contractAddress: string, contributorAddress: string): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _checkIsAdmin(contractAddress, contributorAddress, ethersSigner);
    };

    const addAdmin = async (contractAddress: string, newAdminAddress: string): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _addAdmin(contractAddress, newAdminAddress, ethersSigner);
    };

    const removeAdmin = async (contractAddress: string, adminAddressToRemove: string): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _removeAdmin(contractAddress, adminAddressToRemove, ethersSigner);
    };


    return {
        checkAdminContributors,
        addAdmin,
        removeAdmin,
        checkIsAdmin,
        ethersSigner,
    };
}