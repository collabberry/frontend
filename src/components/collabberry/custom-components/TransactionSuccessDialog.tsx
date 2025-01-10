import React, { useMemo } from 'react'
import { Dialog } from '@/components/ui'
import LottieAnimation from '../LottieAnimation';
import * as animationData from "@/assets/animations/check2.json";


interface SuccessDialogProps {
    dialogVisible: boolean;
    txHash?: string;
    txBlockExplorer?: string;
    txNetwork?: string;
    dialogMessage?: string;
    handleDialogClose: () => void;
}

const shortenTxHash = (hash: string, txBlockExplorer: string, start = 6, end = 4,) => {
    if (!hash) return ''
    return `${txBlockExplorer}${hash.slice(0, start)}...${hash.slice(-end)}`
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
    dialogVisible,
    txHash,
    txBlockExplorer,
    txNetwork,
    dialogMessage,
    handleDialogClose,
}) => {
    const shortenedTx = useMemo(() => shortenTxHash(txHash ?? '', txBlockExplorer ?? ''), [txHash, txBlockExplorer]);

    return (
        <Dialog isOpen={dialogVisible} onClose={handleDialogClose} shouldCloseOnOverlayClick>
            <div className=" flex flex-col items-center justify-center p-2 min-h-[200px]">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-3 mt-3 text-center">
                        {dialogMessage}
                    </h2>
                    <div className="mb-2 text-center text-md flex flex-col items-center">
                        <p>See your transaction on {txNetwork}: </p>
                        <a
                            href={`${txBlockExplorer}${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-md text-blue-600 underline hover:text-blue-800"
                        >
                            {shortenedTx}
                        </a>
                    </div>
                    <div className="pointer-events-none select-none">
                        {animationData && (
                            <LottieAnimation animationData={animationData} height={150}
                                width={150} />
                        )}
                    </div>
                    {/* <div className="flex justify-end mt-4 gap-4">
                        <Button type="button" onClick={handleDialogClose}>
                            Close
                        </Button>
                    </div> */}
                </div>
            </div>
        </Dialog>
    )
}

export default SuccessDialog
