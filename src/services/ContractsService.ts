import { abi as teamPointsFactoryAbi } from '../abi/TeamPointsFactory.json';
import { abi as teamPointsAbi } from '../abi/TeamPoints.json';
import { useEthersSigner } from '@/utils/hooks/useEthersSigner';
import { ethers, EventLog } from 'ethers';
import { useAccount } from 'wagmi';
import { environment } from '@/api/environment';
import { ContractResponseStatus, DEFAULT_ERROR_MESSAGE } from '@/utils/parseErrorMessage';


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

export const getEvent = (logs: any, eventName: string): EventLog => {
    return logs
        .filter((e: any) => e instanceof EventLog)
        .find((e: EventLog) => e.eventName === eventName);
};



export interface ContractResponse {
    data?: any;
    event?: EventLog;
    message: string;
    status: ContractResponseStatus;
}



const _deployTeamPoints = async (ethersSigner: ethers.JsonRpcSigner | undefined, orgName: string): Promise<ContractResponse> => {
    try {
        const factoryAddress = environment?.teamPointsFactoryAddress;
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


const _fetchTokenDetailsAndAddToWallet = async (contractAddress: string, ethersSigner: ethers.JsonRpcSigner, tokenImage: string) => {
    debugger;
    try {
      // Get your active provider (if using wagmi/RainbowKit, you likely have this available)
      const provider = window.ethereum;
      if (!provider) {
        return {
          message:
            "Ethereum provider is not available. Please install MetaMask or use a compatible wallet.",
          status: ContractResponseStatus.Failed,
        };
      }
  
      // Instantiate the contract using ethers.js
      const tokenContract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
  
      // Fetch token details in parallel
      const [name, symbol, decimals] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
      ]);
  
      if (typeof provider.request !== "function") {
        return {
          message:
            "Your wallet does not support automatic token addition. Please add it manually.",
          status: ContractResponseStatus.Failed,
        };
      }

    const decimalsAsNumber = Number(decimals);
  
      const wasAdded = await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: contractAddress,
            symbol: symbol,
            decimals: decimalsAsNumber,
            image: tokenImage,
          },
        },
      });
  
      if (wasAdded) {
        return {
          data: {
            contractAddress,
            tokenName: name,
            tokenSymbol: symbol,
          },
          message: "Token added to wallet successfully",
          status: ContractResponseStatus.Success,
        };
      } else {
        return {
          message: "User rejected token addition",
          status: ContractResponseStatus.Failed,
        };
      }
    } catch (error) {
      console.error("Error fetching token details or adding to wallet:", error);
      return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
      };
    }
  };


const _readSettings = async (contractAddress: string, ethersSigner: ethers.JsonRpcSigner | undefined): Promise<ContractResponse> => {
    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const [isTransferable, isOutsideTransferAllowed, materialWeight, baseTimeWeight] = await Promise.all([
            contract.isTransferable(),
            contract.isOutsideTransferAllowed(),
            contract.materialContributionWeight(),
            contract.baseTimeWeight()

        ]);
        return {
            data: { isTransferable, isOutsideTransferAllowed, materialWeight, baseTimeWeight },
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

const _updateConfig = async (
    contractAddress: string,
    isTransferable: boolean,
    isOutsideTransferAllowed: boolean,
    materialWeight: BigInt,
    baseTimeWeight: BigInt,
    enableTimeScaling: boolean,
    maxTimeScaling: BigInt,
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const tx = await contract.updateConfig(isTransferable,
            isOutsideTransferAllowed,
            materialWeight,
            baseTimeWeight,
            enableTimeScaling,
            maxTimeScaling);
        const receipt = await tx.wait();
        // Extract the event from the transaction logs
        const event = getEvent(receipt.logs, 'ConfigUpdated');
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
                baseTimeWeight: event.args.baseTimeWeight,
                enableTimeScaling: event.args.enableTimeScaling,
                maxTimeScaling: event.args.maxTimeScaling,
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
    timeContributions: bigint[],
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

const _manualAllocation = async (
    contractAddress: string,
    recipients: string[],
    amounts: number[],
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        // Convert amounts to the appropriate unit
        const amountsInWei = amounts.map((amount) =>
            ethers.parseUnits(amount.toString(), 18)
        );
        const tx = await contract.manualAllocation(recipients, amountsInWei);
        const receipt = await tx.wait();

        return {
            message: 'Manual allocation successful',
            status: ContractResponseStatus.Success,
            data: {
                transactionHash: receipt.hash,
            }
        };
    } catch (error) {
        console.error('Error in manual allocation:', error);
    }
    return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
    };
};

const _getBalance = async (contractAddress: string, userAddress: string, ethersSigner: ethers.JsonRpcSigner | undefined): Promise<ContractResponse> => {
    try {
        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const balance = await contract.balanceOf(userAddress);
        return {
            data: { balance },
            message: 'Balance fetched successfully',
            status: ContractResponseStatus.Success,
        };
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
    return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
    };
};

const _getTotalSupply = async (
    contractAddress: string,
    ethersSigner: ethers.JsonRpcSigner | undefined
): Promise<ContractResponse> => {
    try {
        if (!ethersSigner) {
            return {
                message: 'Signer is not available',
                status: ContractResponseStatus.Failed,
            };
        }

        const contract = new ethers.Contract(contractAddress, teamPointsAbi, ethersSigner);
        const totalSupply = await contract.totalSupply();
        return {
            data: {
                totalSupply
            },
            message: 'Total supply fetched successfully',
            status: ContractResponseStatus.Success,
        };

    } catch (error) {
        console.error('Error fetching total supply:', error);
    }
    return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
    };
}

const _checkAdminContributors = async (
    contractAddress: string,
    contributors: any[],
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
  
      const adminStatuses = await Promise.all(
        contributors.map(async (contributor) => {
          const isAdmin = await contract.isAdmin(contributor.address);
          return { contributor, isAdmin };
        })
      );
  
      const adminContributors = adminStatuses
        .filter(({ isAdmin }) => isAdmin)
        .map(({ contributor }) => contributor);
  
      return {
        data: { adminContributors },
        message: 'Admin contributors checked successfully',
        status: ContractResponseStatus.Success,
      };
    } catch (error) {
      console.error('Error checking admin contributors:', error);
      return {
        message: DEFAULT_ERROR_MESSAGE,
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
      console.error('Error adding admin:', error);
      return {
        message: DEFAULT_ERROR_MESSAGE,
        status: ContractResponseStatus.Failed,
      };
    }
  };


export const useContractService = () => {
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

    const fetchTokenDetailsAndAddToWallet = async (contractAddress: string, tokenImage: string) => {
        if (!ethersSigner) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _fetchTokenDetailsAndAddToWallet(contractAddress, ethersSigner, tokenImage);
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

    const updateConfig = async (
        contractAddress: string,
        isTransferable: boolean,
        isOutsideTransferAllowed: boolean,
        materialWeight: BigInt,
        baseTimeWeight: BigInt,
        enableTimeScaling: boolean,
        maxTimeScaling: BigInt,

    ): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _updateConfig(contractAddress, 
            isTransferable, 
            isOutsideTransferAllowed, 
            materialWeight, 
            baseTimeWeight,
            enableTimeScaling,
            maxTimeScaling, 
            ethersSigner);
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

        const timeContributionsInWei = timeContributions.map((contribution) =>
            ethers.parseUnits(contribution.toString(), 18)
        );
        return await _batchMint(contractAddress, recipients, materialContributions, timeContributionsInWei, ethersSigner);
    };

    const manualAllocation = async (
        contractAddress: string,
        recipients: string[],
        amounts: number[]
    ): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        if (recipients.length !== amounts.length) {
            return {
                message: 'Input arrays must have the same length.',
                status: ContractResponseStatus.Failed,
            };
        }

        return await _manualAllocation(contractAddress, recipients, amounts, ethersSigner);
    };

    const getBalance = async (contractAddress: string): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _getBalance(contractAddress, address, ethersSigner);
    };

    const fetchTotalSupply = async (contractAddress: string): Promise<ContractResponse> => {
        if (!ethersSigner || !address) {
            return {
                message: 'Please connect your wallet',
                status: ContractResponseStatus.Failed,
            };
        }
        return await _getTotalSupply(contractAddress, ethersSigner);
    };

    const checkAdminContributors = async (contractAddress: string, contributors: any[]): Promise<ContractResponse> => {
        return await _checkAdminContributors(contractAddress, contributors, ethersSigner);
      };
    



    return {
        deployTeamPoints,
        readSettings,
        getBalance,
        fetchTotalSupply,
        updateConfig,
        batchMint,
        manualAllocation,
        checkAdminContributors,
        fetchTokenDetailsAndAddToWallet,
        ethersSigner,
    };
}