import { environment } from "@/api/environment";
import { handleSuccess } from "@/components/collabberry/helpers/ToastNotifications";
import { Button, FormItem, Input } from "@/components/ui";
import React from "react";
import { FiCopy } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

const InvitationLink: React.FC<any> = ({ invitationToken }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };
  const link = `${environment?.appUrl}/invite?invitationToken=${invitationToken}`;
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 mt-4">Invite Link</h2>
      <div className="flex flex-row items-center space-x-2">
        <Input value={link} readOnly />
        <Button
          shape="circle"
          size="sm"
          color={isCopied ? "green-500" : ""}
          variant="twoTone"
          icon={isCopied ? <FiCheck /> : <FiCopy />}
          onClick={handleClick}
        />
      </div>
    </>
  );
};

export default InvitationLink;
