import { Button } from "@/components/ui";
import { Contributor } from "@/models/Organization.model";
import React, { useMemo } from "react";
import placeholderIcon from '@/assets/images/placeholder.jpg';
import { shortenAddress } from "@/components/collabberry/utils/shorten-address";
import { useDialog } from "@/services/DialogService";
import ConfirmationDialog from "@/components/collabberry/custom-components/ConfirmationDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { handleErrorMessage, handleSuccess } from "@/components/collabberry/helpers/ToastNotifications";
import LoadingDialog from "@/components/collabberry/custom-components/LoadingDialog";
import { FaUserAltSlash } from "react-icons/fa";
import { apiDeleteContributorAgreement } from "@/services/OrgService";
import { useDispatch } from "react-redux";
import { useHandleError } from "@/services/HandleError";
import { refreshOrganizationData } from "@/services/LoadAndDispatchService";


interface ViewAgreementProps {
  contributor: Contributor;
  handleClose: () => void;
}



export const ContributorHeader: React.FC<{ contributor: Contributor, shortAddress?: boolean }> = ({
  contributor,
  shortAddress = false,
}) => {
  const { profilePicture, username, walletAddress } = contributor;
  const address = shortAddress ? shortenAddress(walletAddress) : walletAddress;

  return (
    <>
      <div className="flex flex-row items-center mb-4 mt-4">

        <img
          src={profilePicture ?? placeholderIcon
          }
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-2"
        />

        <div className="flex flex-col items-start">
          {username && <p className="font-bold">{username}</p>}
          {walletAddress && (
            <p className="hidden xl:block">{walletAddress}</p>
          )}
          {walletAddress && (
            <p className="block xl:hidden">{address}</p>
          )}
        </div>
      </div>
    </>
  );
};

const AgreementDetails: React.FC<{ contributor: Contributor }> = ({
  contributor,
}) => {
  const { agreement } = contributor;


  const { marketRate, roleName, responsibilities, fiatRequested, commitment } =
    agreement || {};



  return (
    <>

      <div className="mt-4 p-4 bg-berrylavender-100 rounded">
        <div className="flex flex-row justify-between font-semibold text-berrylavender-700">
          <p>{`Commitment: ${commitment ? commitment?.toFixed(0) : "Not Set"}%`}</p>
          <p>|</p>
          <p>{`Market Rate: $${marketRate ? marketRate : "Not Set"}`}</p>
          <p>|</p>
          <p>{`Monetary Comp: $${fiatRequested ? fiatRequested : "Not Set"
            }`}</p>
        </div>
      </div>
      <div className="max-h-96 overflow-y-scroll">
        <h2 className="text-4xl font-bold mt-4 mb-4">Agreement</h2>

        <div className="flex justify-end mb-4">
        </div>
        <div className="mb-2">
          <div className="font-bold">Role:</div>
          <div>{roleName}</div>
        </div>
        <div>
          <div className="font-bold">Responsibilities:</div>
          <div className="whitespace-pre-line">{responsibilities}</div>
        </div>
      </div>
    </>
  );
}

const ViewAgreement: React.FC<ViewAgreementProps> = ({
  contributor,
  handleClose,
}) => {


  const organization = useSelector((state: RootState) => state.auth.org);
  const { isAdmin, id } = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const handleError = useHandleError();

  const { isOpen: isRemoveAgreement, openDialog: openRemoveAgreementDialog, closeDialog: closeRemoveAgreementDialog } = useDialog();
  const { isOpen: isLoadingDialogOpen, openDialog: openLoadingDialog, closeDialog: closeLoadingDialog } = useDialog();


  const contributorMe = useMemo(() => {
    return organization?.contributors?.find((c: Contributor) => c.id === id);
  }, [organization, id]);

  const isAuthenticatedContributor = useMemo(() => {
    return contributorMe?.id === contributor?.id;
  }, [contributorMe, contributor]);


  const confirmRemoveAgreement = async () => {
    if (!isAdmin) {
      handleErrorMessage("Only admins can remove agreements.");
      return;
    }
    closeRemoveAgreementDialog();
    openLoadingDialog();
    try {
      const response = await apiDeleteContributorAgreement(contributor?.agreement?.id || '');
      if (response) {
        handleSuccess("Agreement removed successfully.");
        refreshOrganizationData(organization.id || '', dispatch, handleError);
      }
    }
    catch (error) {
      handleError(error);

    }
    finally {
      closeLoadingDialog();
      handleClose();
    }

  }
  return (
    <>
      <ContributorHeader contributor={contributor} />
      <AgreementDetails contributor={contributor} />
      {isAdmin && isRemoveAgreement && (

        <ConfirmationDialog
          handleDialogClose={closeRemoveAgreementDialog}
          handleDialogConfirm={() => confirmRemoveAgreement()}
          dialogMessage={`Are you sure you want to remove ${contributor?.username}'s agreement? This action cannot be undone.`}
          dialogVisible={isRemoveAgreement}
        >
        </ConfirmationDialog>

      )}
      {
        isLoadingDialogOpen && (
          <LoadingDialog
            dialogVisible={isLoadingDialogOpen}
            title="Loading..."
            message="Please wait while the agreement is being removed."
            handleDialogClose={() => null}
          />
        )
      }
      <div className="flex justify-end mt-4 gap-4">
        {isAdmin && !isAuthenticatedContributor && (
          <Button
            className="ltr:mr-2 rtl:ml-2 self-start"
            variant="twoTone"
            color="pink-600"
            onClick={() => openRemoveAgreementDialog()}
            icon={<FaUserAltSlash />
            }
          >
            Remove Agreement
          </Button>
        )}
        <Button type="button" className="self-end" onClick={() => handleClose()}>
          Close
        </Button>
      </div>
    </>
  );
};
export default ViewAgreement;
