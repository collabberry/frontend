import AnimatedRainbowBerrySvg from "@/assets/svg/AnimatedRainbowBerry";
import { Alert, Avatar, Button, Card } from "@/components/ui";
import { Contributor } from "@/models/Organization.model";
import {
  apiGetAssessmentsByAssessed,
  apiGetMyScores,
} from "@/services/OrgService";
import { RootState } from "@/store";
import { use } from "i18next";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import placeholderIcon from '@/assets/images/placeholder.jpg';
import { HiArrowSmLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ScoreCard, ScoreDetailCard } from "./ScoreDetailCard";





const MyScores: React.FC = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { selectedRound } = useSelector(
    (state: RootState) => state.auth.rounds
  );
  const navigate = useNavigate();
  const [scores, setScores] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  const navigateBack = () => {
    navigate(-1);
  };

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
          <div>
            <Button size="sm" onClick={navigateBack} icon={<HiArrowSmLeft />}>
              Back to Results
            </Button>
          </div>
          <div className="flex flex-col justify-start mt-4">
            <h1>Round {scores?.roundName}</h1>
            {/* <h5>My Results</h5> */}
          </div>
          <div className="mt-4">
            {
              assessments.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
              ) : (
                <Alert showIcon type="info" className="mt-4">
                  <p>
                    You have not received any assessments during this round.
                  </p>
                </Alert>
              )
            }

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
