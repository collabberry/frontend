import React, { useMemo } from 'react'
import { Dialog } from '@/components/ui'
import LottieAnimation from '../LottieAnimation';
import * as animationData from "@/assets/animations/check2.json";
import { shortenTxHash } from '../utils/shorten-address';


interface SuccessDialogProps {
    dialogVisible: boolean;
    txHash?: string;
    blockExplorer?: string;
    txNetwork?: string;
    dialogMessage?: string;
    handleDialogClose: () => void;
}



const SuccessDialog: React.FC<SuccessDialogProps> = ({
    dialogVisible,
    txHash,
    blockExplorer,
    txNetwork,
    dialogMessage,
    handleDialogClose,
}) => {
    const shortenedTx = useMemo(() => shortenTxHash(txHash ?? '', blockExplorer ?? ''), [txHash, blockExplorer]);

    return (
        <Dialog isOpen={dialogVisible} onClose={handleDialogClose} shouldCloseOnOverlayClick>
            <div className=" flex flex-col items-center justify-center p-2 min-h-[200px]">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4 mt-3 text-center">
                        {dialogMessage}
                    </h2>
                    <div className="mb-2 text-center text-md flex flex-col items-center">
                        <p>See your transaction on {txNetwork}: </p>
                        <a
                            href={`${blockExplorer}/${txHash}`}
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
