import { Assessment } from "@/@types/auth";
import {
  apiActivateRounds,
  apiAddAssessment,
  apiGetCurrentRound,
} from "@/services/OrgService";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const Rounds: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const assessment: Assessment = {
    contributorId: "",
    cultureScore: 3,
    workScore: 3,
    feedbackPositive: "Good job!",
    feedbackNegative: "You're kinda mean.",
  };
  return (
    <div>
      <h1>Rounds</h1>
      <p>This is the Rounds view.</p>
      <div className="flex flex-col space-y-4">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
          onClick={() => apiActivateRounds(organization.id || "")}
        >
          Activate Rounds
        </button>
        <button
          className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full max-w-[250px]"
          onClick={() => apiGetCurrentRound(organization.id || "")}
        >
          Get Current Round
        </button>
      </div>
    </div>
  );
};

export default Rounds;
