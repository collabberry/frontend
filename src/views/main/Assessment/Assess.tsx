import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Dialog,
  FormContainer,
  FormItem,
  Input,
} from "@/components/ui";
import ViewAgreement, { ContributorHeader } from "../Team/ViewAgreement";
import { Contributor } from "@/models/Organization.model";
import BerryRating from "@/components/collabberry/custom-components/CustomFields/BerryRating";
import { useFormik } from "formik";
import { CustomSteps } from "@/components/ui/Steps";
import {
  getCultureScoreDescription,
  getWorkContributionDescription,
} from "./score-helpers";
import { apiAddAssessment, apiEditAssessment } from "@/services/OrgService";
import {
  handleError,
} from "@/components/collabberry/helpers/ToastNotifications";
import LottieAnimation from "@/components/collabberry/LottieAnimation";
import * as animationData from "@/assets/animations/success.json";
import { refreshAllRounds, refreshCurrentRound } from "@/services/LoadAndDispatchService";

const Assess = () => {
  const dispatch = useDispatch();
  const organization = useSelector((state: RootState) => state.auth.org);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const [teamMemberIndex, setTeamMemberIndex] = useState(0);
  const [reviewedMembers, setReviewedMembers] = useState<string[]>([]);

  const { teamMembers } = useSelector(
    (state: RootState) => state.auth.assessment
  );

  const validationSchema = useMemo(() => {
    const schemaShape = teamMembers.reduce(
      (acc: { [key: string]: Yup.ObjectSchema<any> }, member) => {
        acc[member.id] = Yup.object().shape({
          cultureScore: Yup.number().required("Rating is required"),
          workScore: Yup.number().required("Rating is required"),
          feedbackPositive: Yup.string(),
          feedbackNegative: Yup.string(),
        });
        return acc;
      },
      {}
    );
    return Yup.object().shape(schemaShape);
  }, [teamMembers]);

  const currentMember = useMemo(
    () => teamMembers[teamMemberIndex],
    [teamMembers, teamMemberIndex]
  );

  const navigate = useNavigate();
  const [isViewAgreementDialogOpen, setIsViewAgreementDialogOpen] =
    useState(false);

  const onStepChange = (index: number) => {
    setTeamMemberIndex(index);
    formik.setFieldTouched(currentMember.id, false, true);
  };

  const memberInitialValues = {
    cultureScore: 0,
    workScore: 0,
    feedbackPositive: "",
    feedbackNegative: "",
  };
  const getInitialValues = (member: Contributor) => {
    if (member.submittedAssessment && member.submittedAssessment.id) {
      return {
        cultureScore: member.submittedAssessment.cultureScore,
        workScore: member.submittedAssessment.workScore,
        feedbackPositive: member.submittedAssessment.feedbackPositive,
        feedbackNegative: member.submittedAssessment.feedbackNegative,
      };
    }
    return memberInitialValues;
  };

  const formik = useFormik({
    initialValues: teamMembers.reduce((acc: any, member: Contributor) => {
      acc[member.id] = getInitialValues(member);
      return acc;
    }, {}),
    validateOnMount: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      return;
    },
  });

  // const handleSubmit = async (values: any) => {
  //   const currentMemberData = values[currentMember.id];
  //   const assessment = {
  //     ...currentMemberData,
  //     contributorId: currentMember.id,
  //   };
  //   try {
  //     const response = await apiAddAssessment(assessment);
  //     const { data } = response;
  //     if (data && organization.id) {
  //       refreshAllRounds(dispatch);
  //       refreshCurrentRound(dispatch);
  //     }

  //     setReviewedMembers([...reviewedMembers, currentMember.id]);
  //     const nextIncompleteStep = teamMembers.findIndex(
  //       (member, index) =>
  //         !reviewedMembers.includes(member.id) && index !== teamMemberIndex
  //     );

  //     if (nextIncompleteStep !== -1) {
  //       setTeamMemberIndex(nextIncompleteStep);
  //     }
  //   } catch (error: any) {
  //     handleError(error.response.data.message);
  //   }
  // };


  const handleSubmit = async (values: any) => {
    const currentMemberData = values[currentMember.id];

    try {
      if (currentMember.submittedAssessment && currentMember.submittedAssessment.id) {
        const { submittedAssessment } = currentMember;
        const { id, assessedId, assessedName, assessorId, assessorName, ...restOfSubmittedAssessment } = submittedAssessment;
        const updatedAssessment = {
          ...restOfSubmittedAssessment,
          ...currentMemberData,
          contributorId: currentMember.id,
        };
        // If editing fails, the following line throws an error and execution jumps to catch.
        await onEditAssessment(updatedAssessment, id);
      } else {
        // Create a new assessment.
        const assessment = {
          ...currentMemberData,
          contributorId: currentMember.id,
        };
        const response = await apiAddAssessment(assessment);
        if (response && response.data && organization.id) {
          refreshAllRounds(dispatch);
          refreshCurrentRound(dispatch);
        }
      }

      // If execution reaches here, neither adding nor editing failed.
      if (!reviewedMembers.includes(currentMember.id)) {
        setReviewedMembers([...reviewedMembers, currentMember.id]);
      }

      const nextIncompleteStep = teamMembers.findIndex(
        (member, index) =>
          !reviewedMembers.includes(member.id) && index !== teamMemberIndex
      );
      if (nextIncompleteStep !== -1) {
        setTeamMemberIndex(nextIncompleteStep);
      }
    } catch (error: any) {
      // The error is handled here. The current member remains unchanged (i.e. not marked as reviewed)
      // and the user will not navigate to the next member.
      const errorMessage = currentMember.submittedAssessment
        ? error.response?.data?.message || "Error editing assessment"
        : error.response?.data?.message || "Error creating assessment";

      handleError(errorMessage);
    }
  };

  const onEditAssessment = async (assessment: any, assessmentId: string) => {
    try {
      const response = await apiEditAssessment(
        assessmentId,
        currentRound?.id,
        assessment
      );

    } catch (error) {
      throw error;
    }
  };

  const isMemberFormValid = useMemo(() => {
    const errors =
      (formik.errors as any) ||
      teamMembers.reduce((acc: { [key: string]: any }, member) => {
        acc[member.id] = {};
        return acc;
      }, {});

    const currentMemberErrors = errors[currentMember.id] || {};
    return Object.keys(currentMemberErrors).length === 0;
  }, [teamMemberIndex, formik.errors]);

  const viewAgreement = (contributor: Contributor) => {
    if (contributor && Object.keys(contributor).length > 0) {
      setIsViewAgreementDialogOpen(true);
    }
  };

  const handleViewAgreementDialogClose = () => {
    setIsViewAgreementDialogOpen(false);
  };

  useEffect(() => {
    if (!teamMembers || teamMembers.length === 0) {
      navigate("/assessment");
    }
  }, [teamMembers]);

  return (
    <>
      {reviewedMembers.length === teamMembers.length ? (
        <div className="flex justify-center items-center flex-col mt-4">
          <div className="text-center text-lg font-bold max-w-[600px]">
            Great job! You have submitted assessments for all the selected team
            members. If you want to select more team members, you can go back to
            the assessment panel.
          </div>
          <div className="mt-4">
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate("/assessment")} className="ml-2">
              Go to Assessment Panel
            </Button>
          </div>
          <div>
            <LottieAnimation animationData={animationData} />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-4 w-full">
          <CustomSteps
            current={teamMemberIndex}
            vertical
            onChange={(index) => onStepChange(index)}
            className="justify-start mr-4"
          >
            {teamMembers.map((member, index) => (
              <CustomSteps.StepItemWithAvatar
                key={index}
                title={member.username}
                avatar={member.profilePicture}
                status={
                  reviewedMembers.includes(member.id)
                    ? "complete"
                    : "in-progress"
                }
              >
                <div>Assessment for {member.username}</div>
              </CustomSteps.StepItemWithAvatar>
            ))}
          </CustomSteps>
          <Card className="w-full">
            <div className="flex justify-between items-center">
              <ContributorHeader contributor={currentMember} />
              <Button
                size="sm"
                onClick={() => {
                  const member = teamMembers[teamMemberIndex];
                  viewAgreement(member);
                }}
              >
                View Agreement
              </Button>
            </div>
            <div>
              <FormContainer>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <FormItem label="">
                    <div className="text-2xl">Culture Impact</div>
                    <BerryRating
                      setFieldValue={formik.setFieldValue}
                      field={`${currentMember.id}.cultureScore`}
                      value={formik.values[currentMember.id]?.cultureScore || 0}
                    />
                    <div className="mt-4">
                      {getCultureScoreDescription(
                        formik.values[currentMember.id]?.cultureScore
                      )}
                    </div>
                  </FormItem>
                  <FormItem label="">
                    <div className="text-2xl">Work Contribution</div>
                    <BerryRating
                      setFieldValue={formik.setFieldValue}
                      field={`${currentMember.id}.workScore`}
                      value={formik.values[currentMember.id]?.workScore || 0}
                    />
                    <div className="mt-4">
                      {getWorkContributionDescription(
                        formik.values[currentMember.id]?.workScore
                      )}
                    </div>
                  </FormItem>
                </div>
                <div className="flex flex-col mt-8">
                  <div className="text-2xl mb-4">Feedback</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {`What do you think ${currentMember.username} did well in the past month, appreciate in them, and believe they should continue doing this way?`}
                    </div>
                    <div>
                      {`What do you think ${currentMember.username} didn't do well in the past month or can work on to improve?`}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormItem label="">
                      <Input
                        name={`${currentMember.id}.feedbackPositive`}
                        textArea
                        rows={5}
                        placeholder={`I appreciate that ${currentMember.username}...`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={
                          formik.values[currentMember.id]?.feedbackPositive ||
                          ""
                        }
                      />
                    </FormItem>
                    <FormItem label="">
                      <Input
                        textArea
                        rows={5}
                        placeholder={`${currentMember.username} could improve by...`}
                        name={`${currentMember.id}.feedbackNegative`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={
                          formik.values[currentMember.id]?.feedbackNegative ||
                          ""
                        }
                      />
                    </FormItem>
                  </div>
                </div>
              </FormContainer>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  onClick={() => handleSubmit(formik.values)}
                  disabled={!isMemberFormValid || formik.isSubmitting}
                >
                  {currentMember.submittedAssessment?.id ? "Edit Assessment" : "Submit Assessment"}
                </Button>
              </div>
            </div>
          </Card>
          {isViewAgreementDialogOpen && (
            <Dialog
              width={600}
              isOpen={isViewAgreementDialogOpen}
              onClose={handleViewAgreementDialogClose}
            >
              <ViewAgreement
                contributor={currentMember}
                handleClose={handleViewAgreementDialogClose}
              />
            </Dialog>
          )}
        </div>
      )}
    </>
  );
};

export default Assess;
