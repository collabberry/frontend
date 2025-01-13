import React, { useMemo } from 'react'
import { Dialog } from '@/components/ui'
import LottieAnimation from '../LottieAnimation';
import * as animationData from "@/assets/animations/clock.json";


interface LoadingDialogProps {
    dialogVisible: boolean;
    title?: string;
    message?: string;
    handleDialogClose: () => void;
}

const ErrorDialog: React.FC<LoadingDialogProps> = ({
    dialogVisible,
    message,
    title = 'Loading...',
    handleDialogClose,
}) => {

    return (
        <Dialog isOpen={dialogVisible} onClose={handleDialogClose} shouldCloseOnOverlayClick>
            <div className=" flex flex-col items-center justify-center p-2 min-h-[200px]">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-3 mt-3 text-center">
                        {title}
                    </h2>
                    <div className="mb-2 text-center text-md flex flex-col items-center">
                        <p>{message}</p>
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

export default ErrorDialog
