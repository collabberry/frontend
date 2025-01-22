import AnimatedRainbowBerrySvg from "@/assets/svg/AnimatedRainbowBerry";
import { Avatar, Card } from "@/components/ui";
import { Contributor } from "@/models/Organization.model";
import {
  apiGetAssessmentsByAssessed,
  apiGetMyScores,
} from "@/services/OrgService";
import { RootState } from "@/store";
import { use } from "i18next";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface ScoreCardProps {
  title: string;
  score: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score }) => {
  return (
    <Card className="p-4 border rounded">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-4xl">{score.toFixed(1)}</p>
    </Card>
  );
};

interface ScoreDetailProps {
  contributor: Contributor;
  workScore: number;
  cultureScore: number;
  feedbackPositive: string;
  feedbackNegative: string;
}

export const ScoreDetailCard: React.FC<ScoreDetailProps> = ({
  contributor,
  workScore,
  cultureScore,
  feedbackPositive,
  feedbackNegative,
}) => {
  return (
    <Card className="p-4 border rounded relative">
      {(workScore === 5 || cultureScore === 5) && (
        <div className="flex items-center absolute top-5 right-5 m-2">
          <AnimatedRainbowBerrySvg />
        </div>
      )}
      <div className="flex flex-row gap-4">
        <div className="flex flex-row items-center justify-start min-w-[120px]">
          <Avatar
            className="mr-2 rounded-full"
            src={contributor.profilePicture}
          />
          <span>{contributor.username}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold">Culture Impact</h3>
            <p className="text-2xl">{cultureScore.toFixed(1)}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Work Contribution</h3>
            <p className="text-2xl">{workScore.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="mt-4">
          <h3 className="font-semibold text-sm uppercase">Did well</h3>
          <p className="mt-1">{feedbackPositive || '-'}</p>
        </div>


        <div className="mt-4">
          <h3 className="font-semibold text-sm uppercase">Could Improve</h3>
          <p className="mt-1">{feedbackNegative || '-'}</p>
        </div>
      </div>
    </Card>
  );
};

const MyScores: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { selectedRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );
  const [scores, setScores] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchScores = async () => {
      const scores = await apiGetMyScores();
      const selectedRoundScores = scores.data.find(
        (score: any) => score.roundId === selectedRound?.id
      );
      setScores(selectedRoundScores);
      setAssessments(selectedRoundScores?.assessments);
    };
    fetchScores();
  }, []);

  return (
    <>
      {selectedRound && scores && (
        <div>
          <div className="flex flex-row justify-between">
            <h1>Round {scores?.roundName}</h1>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-4">
            <ScoreCard
                title="Total Score"
                score={scores?.totalScore || (scores?.totalCultureScore + scores?.totalWorkScore) / 2}
              ></ScoreCard>
              <ScoreCard
                title="Culture Score"
                score={scores?.totalCultureScore}
              ></ScoreCard>
              <ScoreCard
                title="Work Score"
                score={scores?.totalWorkScore}
              ></ScoreCard>
            </div>
          </div>
          {/* TODO: Change this to scores.assessments when the BE is fixes */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            {assessments?.map(
              ({
                assessor,
                cultureScore,
                workScore,
                feedbackNegative,
                feedbackPositive,
              }: {
                assessor: Contributor;
                cultureScore: number;
                workScore: number;
                feedbackNegative: string;
                feedbackPositive: string;
              }) => (
                <ScoreDetailCard
                  key={assessor?.id}
                  contributor={assessor}
                  workScore={workScore}
                  cultureScore={cultureScore}
                  feedbackPositive={feedbackPositive}
                  feedbackNegative={feedbackNegative}
                />
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyScores;
