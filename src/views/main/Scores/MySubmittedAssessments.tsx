import AnimatedRainbowBerrySvg from "@/assets/svg/AnimatedRainbowBerry";
import { Alert, Avatar, Button, Card, Skeleton } from "@/components/ui";
import { Contributor } from "@/models/Organization.model";
import {
    apiGetAssessmentsByAssessed,
    apiGetAssessmentsByAssessor,
    apiGetMyScores,
} from "@/services/OrgService";
import { RootState } from "@/store";
import { use } from "i18next";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { HiArrowSmLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { round, set } from "lodash";
import { ScoreDetailCard } from "./ScoreDetailCard";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";


const MySubmittedAssessments: React.FC = () => {
    const organization = useSelector((state: RootState) => state.auth.org);
    const currentRound = useSelector(
        (state: RootState) => state.auth.rounds.currentRound
    );
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const { selectedRound } = useSelector(
        (state: RootState) => state.auth.rounds
    );
    const navigate = useNavigate();
    const [mySubmittedAssessments, setMySubmittedAssessments] = useState<any[]>([]);

    const navigateBack = () => {
        navigate(-1);
    };

    React.useEffect(() => {
        const fetchScores = async () => {
            setLoading(true);
            try {
                const submittedAssessments = await apiGetAssessmentsByAssessor(selectedRound?.id, user?.id);
                if (submittedAssessments.data) {
                    const assessmentsWithContributor = submittedAssessments.data.map((assessment: any) => {
                        const assessed = organization?.contributors?.find((contributor: Contributor) => contributor.id === assessment.assessedId);
                        return { ...assessment, assessed };
                    });
                    setMySubmittedAssessments(assessmentsWithContributor);

                }
            } catch {
                console.error("Error fetching scores");
            } finally {
                setLoading(false);
            }

        };
        fetchScores();
    }, []);

    const onEditAssessment = (assessment: any) => {
        console.log(assessment, "ASSESSMENT");
    };

    return (
        <>
            {selectedRound && mySubmittedAssessments && (
                <div>
                    <div>
                        <Button size="sm" onClick={navigateBack} icon={<HiArrowSmLeft />}>
                            Back to Results
                        </Button>
                    </div>
                    <div className="flex flex-col justify-start mt-4">
                        <h1>Round {selectedRound?.roundNumber}</h1>
                        <h5>My Submitted Assessments</h5>
                    </div>


                    {loading ? (
                        <Skeleton height={187} className="mt-4" />
                    ) : (
                        <>
                            {mySubmittedAssessments.length ?

                                (
                                    <>
                                        <div className="mt-8 grid grid-cols-1 gap-4">

                                            {mySubmittedAssessments?.map((assessment) => {
                                                const {
                                                    assessed,
                                                    cultureScore,
                                                    workScore,
                                                    feedbackNegative,
                                                    feedbackPositive,
                                                } = assessment;

                                                return (
                                                    <ScoreDetailCard
                                                        key={assessed?.id}
                                                        contributor={assessed}
                                                        workScore={workScore}
                                                        cultureScore={cultureScore}
                                                        feedbackPositive={feedbackPositive}
                                                        feedbackNegative={feedbackNegative}
                                                        // onEdit={
                                                        //     selectedRound.status === RoundStatus.InProgress
                                                        //         ? () => onEditAssessment(assessment)
                                                        //         : undefined
                                                        // }
                                                        
                                                    />
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <Alert showIcon type="info" className="mt-4">
                                        <p>
                                            You have not submitted any assessments during this round.
                                        </p>
                                    </Alert>
                                )

                            }
                        </>
                    )}



                </div >
            )}
        </>
    );
};

export default MySubmittedAssessments;
