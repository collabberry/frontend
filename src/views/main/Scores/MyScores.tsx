import AnimatedRainbowBerrySvg from "@/assets/svg/AnimatedRainbowBerry";
import { Avatar, Card } from "@/components/ui";
import { Contributor } from "@/models/Organization.model";
import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

interface ScoreCardProps {
  title: string;
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score }) => {
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

const ScoreDetailCard: React.FC<ScoreDetailProps> = ({
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
            <h3 className="text-sm font-semibold">Culture</h3>
            <p className="text-2xl">{cultureScore.toFixed(1)}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Work Delivered</h3>
            <p className="text-2xl">{workScore.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mt-4">
          <h3 className="font-semibold text-sm uppercase">Did well</h3>
          <p className="mt-1">{feedbackPositive}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-sm uppercase">Could Improve</h3>
          <p className="mt-1">{feedbackNegative}</p>
        </div>
      </div>
    </Card>
  );
};

const MyScores: React.FC = () => {
  // TODO: Change the source of contributors once round and score BE is ready, it should not be organization
  const organization = useSelector((state: RootState) => state.auth.org);
  const { selectedRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );

  //TODO: Change once there is BE
  const contributors = organization?.contributors || [];

  const mockedRoundScores = React.useMemo(() => {
    return {
      averageWorkScore: 3.5,
      averageCultureScore: 4.5,
      scores: contributors.map((contributor) => ({
        contributorId: contributor.id,
        contributor: { ...contributor },
        cultureScore: 5,
        workScore: 2.3,
        feedbackPositive:
          "Great work! Keep it up! :) Your dedication and effort are truly commendable, and it shows in the quality of your work. Continue to strive for excellence, and you'll achieve even greater success.",
        feedbackNegative:
          "Needs improvement. While there are some good aspects, there are areas that require more attention and effort. Focus on these areas, and don't hesitate to seek help or feedback to improve.",
      })),
    };
  }, []);

  const roundId = 1;

  return (
    <>
      {selectedRound && (
        <div>
          <div className="flex flex-row justify-between">
            <h1>Round {roundId}</h1>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard
                title="Culture Score"
                score={mockedRoundScores.averageCultureScore}
              ></ScoreCard>
              <ScoreCard
                title="Work Score"
                score={mockedRoundScores.averageWorkScore}
              ></ScoreCard>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4">
            {mockedRoundScores.scores.map((scoreDetail) => (
              <ScoreDetailCard
                key={scoreDetail.contributorId}
                contributor={scoreDetail.contributor}
                workScore={scoreDetail.workScore}
                cultureScore={scoreDetail.cultureScore}
                feedbackPositive={scoreDetail.feedbackPositive}
                feedbackNegative={scoreDetail.feedbackNegative}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyScores;
