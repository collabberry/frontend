
import { getAdmins, RootState, setAdmins } from '@/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Dialog, Skeleton, Tag, Tooltip } from '@/components/ui';
import { environment } from '@/api/environment';
import LoadingDialog from '@/components/collabberry/custom-components/LoadingDialog';
import { handleError, handleSuccess } from '@/components/collabberry/helpers/ToastNotifications';
import { useAdminContractService } from '@/services/AdminContractService';
import { useDialog } from '@/services/DialogService';
import isLastChild from '@/utils/isLastChild';
import classNames from 'classnames';
import placeholderIcon from '@/assets/images/placeholder.jpg';
import { HiArrowSmLeft, HiPlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import AddAdminForm from './AddAdminForm';
import { FiDelete, FiTrash } from 'react-icons/fi';
import { ConfirmDialog } from '@/components/shared';
import { Contributor } from '@/models/Organization.model';
import ConfirmationDialog from '@/components/collabberry/custom-components/ConfirmationDialog';


const AdminManagement: React.FC = () => {
    const organization = useSelector((state: RootState) => state.auth.org);
    const { admins } = useSelector((state: RootState) => state.auth.admin);
    const dispatch = useDispatch();
    const { isAdmin } = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();
    const [selectedAdmin, setSelectedAdmin] = useState<Contributor | null>(null);
    const { checkAdminContributors, removeAdmin, ethersSigner } = useAdminContractService();
    const { isOpen: isAddAdminDialogOpen, openDialog: openAddAdminDialog, closeDialog: closeAddAdminDialog } = useDialog();
    const { isOpen: isRemoveAdminDialogOpen, openDialog: openRemoveAdminDialog, closeDialog: closeRemoveAdminDialog } = useDialog();
    const { isOpen: isLoadingDialogOpen, openDialog: openLoadingDialog, closeDialog: closeLoadingDialog } = useDialog();

    const [loading, setLoading] = useState(false);


    const fetchAdminContributors = async () => {
        if (organization?.teamPointsContractAddress && ethersSigner) {
            setLoading(true);
            const response = await checkAdminContributors(organization?.teamPointsContractAddress, organization?.contributors || []);
            if (response.status === 'success' && response.data) {
                dispatch(setAdmins({ admins: response.data.adminContributors }));
                console.log(admins, "ADMINDS");
                setLoading(false);
            } else {

                setLoading(false);
                handleError(response.message || "An error occurred while loading contract settings.");
            }
        }
    };

    const navigateBack = () => {
        navigate('/team');
    }

    const confirmRemoveAdmin = async (contributor: any) => {

        if (organization?.teamPointsContractAddress && ethersSigner) {
            closeRemoveAdminDialog();
            openLoadingDialog();
            const response = await removeAdmin(organization?.teamPointsContractAddress, contributor.walletAddress);
            if (response.status === 'success') {
                fetchAdminContributors();
                closeLoadingDialog();
                handleSuccess("Admin removed successfully.");
            } else {
                handleError(response.message || "An error occurred while removing the admin.");
                closeLoadingDialog();
            }
        }

    }

    useEffect(() => {
        fetchAdminContributors();
    }, [organization.teamPointsContractAddress, ethersSigner]);


    return (
        <>

            {isAdmin && admins && admins.length && (
                <>
                    {/* <div>
                        <Button
                            size="sm"
                            className="mb-2"
                            onClick={navigateBack}
                            icon={<HiArrowSmLeft />}
                        >
                            Back
                        </Button>
                    </div> */}

                    <h1>Admin Management</h1>


                    {/* <SuccessDialog
                        dialogVisible={isSuccessDialogOpen}
                        txHash={txHash || ''}
                        blockExplorer={blockExplorer}
                        txNetwork={network}
                        dialogMessage="You have successfully added the admin."
                        handleDialogClose={() => closeSuccessDialog()}>
                    </SuccessDialog> */}
                    {/* <ErrorDialog dialogVisible={isErrorDialogOpen}
                        errorMessage={errorMessage || ''}
                        handleDialogClose={() => closeErrorDialog()}>
                    </ErrorDialog> */}
                    {/* <LoadingDialog dialogVisible={isLoadingDialogOpen}
                        message={'You will be promped to sign a transaction. This might take a while, so please be patient.'}
                        title="Minting Tokens..."
                        handleDialogClose={() => null}   >
                    </LoadingDialog> */}
                    {isAddAdminDialogOpen && (
                        <Dialog
                            isOpen={isAddAdminDialogOpen}
                            onClose={closeAddAdminDialog}
                            width={600}
                        >
                            <h3>Add Admin</h3>
                            <AddAdminForm
                                handleClose={closeAddAdminDialog}
                            />
                        </Dialog>
                    )}
                    {isRemoveAdminDialogOpen && (

                        <ConfirmationDialog
                            handleDialogClose={closeRemoveAdminDialog}
                            handleDialogConfirm={() => confirmRemoveAdmin(selectedAdmin)}
                            dialogMessage={`Are you sure you want to remove ${selectedAdmin?.username} as an admin? Once you confirm, you will need to sign a transaction, which will will require gas fees.
                        `}
                            dialogVisible={isRemoveAdminDialogOpen}
                        >
                        </ConfirmationDialog>

                    )}
                    {
                        isLoadingDialogOpen && (
                            <LoadingDialog
                                dialogVisible={isLoadingDialogOpen}
                                title="Loading..."
                                message="Please wait while the admin is being removed."
                                handleDialogClose={() => null}
                            />
                        )
                    }
                    <div className='mt-4 w-full xl:w-2/3'>
                        {loading ? (
                            <Skeleton height={74 * admins?.length} />
                        ) : (
                            <>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                                    {admins.map((contributor, index) => (
                                        <div
                                            key={contributor.walletAddress}
                                            className={classNames(
                                                'flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4',
                                                !isLastChild(admins, index) &&
                                                'border-b border-gray-200 dark:border-gray-600'
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={contributor?.profilePicture ?? placeholderIcon
                                                    }
                                                    className="rounded-full object-cover h-10 w-10"
                                                    alt="contributor profile picture"
                                                />

                                                <div className="flex flex-col items-start">
                                                    {contributor?.username && <p className="font-bold">{contributor?.username}</p>}
                                                    {/* {contributor.isAdmin && <Tag className="bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-100 rounded-md border-0 p-1" >Admin</Tag>} */}
                                                    {contributor?.walletAddress && <p>{contributor?.walletAddress}</p>}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {admins?.length === 1 ? (
                                                    (<Tooltip title={'Cannot remove the only admin.'}>
                                                        <Button
                                                            className="mr-2 rtl:ml-2"
                                                            variant="twoTone"
                                                            color="pink-600"
                                                            icon={<FiTrash />}
                                                            size="sm"
                                                            disabled={true}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Tooltip>)
                                                ) : (
                                                    (<Button
                                                        className="mr-2 rtl:ml-2"
                                                        variant="twoTone"
                                                        icon={<FiTrash />}
                                                        size="sm"
                                                        color='pink-600'
                                                        onClick={() => {
                                                            setSelectedAdmin(contributor);
                                                            openRemoveAdminDialog();
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>

                                                    )
                                                )

                                                }

                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <Button
                                        className="mt-4"
                                        icon={
                                            <HiPlus className='text-berrylavender-500' />
                                        }
                                        onClick={openAddAdminDialog}
                                    >
                                        Add Admin
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </>

    )
}

export default AdminManagement;