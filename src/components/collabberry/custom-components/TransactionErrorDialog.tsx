import React, { useMemo } from 'react'
import { Dialog } from '@/components/ui'
import LottieAnimation from '../LottieAnimation';
import * as animationData from "@/assets/animations/error.json";


interface ErrorDialogProps {
    dialogVisible: boolean;
    errorMessage?: string;
    handleDialogClose: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
    dialogVisible,
    errorMessage,
    handleDialogClose,
}) => {

    return (
        <Dialog isOpen={dialogVisible} onClose={handleDialogClose} shouldCloseOnOverlayClick>
            <div className=" flex flex-col items-center justify-center p-2 min-h-[200px]">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-3 mt-3 text-center">
                        Oops, looks like something went wrong!
                    </h2>
                    <div className="mb-2 text-center text-md flex flex-col items-center">
                        <p>{errorMessage}</p>
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
