import React from "react";
import { RoundStatus } from "../../utils/collabberry-constants";
import { Tag } from "@/components/ui";

interface RoundStatusTagProps {
  roundStatus: RoundStatus;
}

const RoundStatusTag: React.FC<RoundStatusTagProps> = ({ roundStatus }) => {
  const getStatusTextAndColor = (status: RoundStatus) => {
    switch (status) {
      case RoundStatus.Completed:
        return { text: "Completed", color: "emerald" };
      case RoundStatus.InProgress:
        return { text: "In Progress", color: "berrylavender" };
      case RoundStatus.NotStarted:
        return { text: "Not Started", color: "amber" };
      default:
        return { text: "Unknown", color: "gray" };
    }
  };
  const status = getStatusTextAndColor(roundStatus);

  return (
    <Tag className={`text-${status.color}-500 bg-${status.color}-50 border-0 h-6`}>
      {status.text}
    </Tag>
  );
};

export default RoundStatusTag;
