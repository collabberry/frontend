import React from 'react'
import { Button, Dialog } from '@/components/ui'



interface ConfirmationDialogProps {
    dialogVisible: boolean;
    dialogMessage?: string;
    handleDialogClose: () => void;
    handleDialogConfirm: () => void;
}


const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    dialogVisible,
    dialogMessage,
    handleDialogClose,
    handleDialogConfirm,
}) => {

    return (
        <Dialog
            isOpen={dialogVisible}
            onClose={handleDialogClose}
        >
            <div className="px-6 pb-6">
                <h3 className="mb-4">Confirm</h3>
                <div>{dialogMessage} </div>
              
            </div>
            <div className="text-right px-6 py-3 rounded-bl-lg rounded-br-lg">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    onClick={handleDialogClose}
                >
                    Cancel
                </Button>
                <Button variant="twoTone" color="pink-600" onClick={handleDialogConfirm}>
                    Remove
                </Button>
            </div>
        </Dialog>
    )
}

export default ConfirmationDialog
