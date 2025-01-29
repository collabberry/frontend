import { Button } from "@/components/ui";
import { Contributor } from "@/models/Organization.model";
import React from "react";
import placeholderIcon from '@/assets/images/placeholder.jpg';


interface ViewAgreementProps {
  contributor: any;
  handleClose: () => void;
}

export const ContributorHeader: React.FC<{ contributor: Contributor }> = ({
  contributor,
}) => {
  const { profilePicture, username, walletAddress } = contributor;
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
          {walletAddress && <p>{walletAddress}</p>}
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
};

const ViewAgreement: React.FC<ViewAgreementProps> = ({
  contributor,
  handleClose,
}) => {
  return (
    <>
      <ContributorHeader contributor={contributor} />
      <AgreementDetails contributor={contributor} />
      <div className="flex justify-end mt-4 gap-4">
        <Button type="button" onClick={() => handleClose()}>
          Close
        </Button>
      </div>
    </>
  );
};
export default ViewAgreement;
