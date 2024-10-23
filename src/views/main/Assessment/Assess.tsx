import { addReviewedMember, RootState, setRounds } from "@/store";
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
  Steps,
} from "@/components/ui";
import ViewAgreement, { ContributorHeader } from "../Team/ViewAgreement";
import { Contributor } from "@/models/Organization.model";
import BerryRating from "@/components/collabberry/custom-components/CustomFields/BerryRating";
import { useFormik } from "formik";
import { StepStatus } from "@/components/ui/@types/common";
import { CustomSteps } from "@/components/ui/Steps";
import { set } from "lodash";
import { ReactElement } from "react-markdown/lib/react-markdown";
import {
  getCultureScoreDescription,
  getWorkContributionDescription,
} from "./score-helpers";
import { apiAddAssessment, apiGetCurrentRound } from "@/services/OrgService";
import {
  handleError,
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";

const Assess = () => {
  const dispatch = useDispatch();
  const organization = useSelector((state: RootState) => state.auth.org);
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
          feedbackPositive: Yup.string().required("Feedback is required"),
          feedbackNegative: Yup.string().required("Feedback is required"),
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

  const formik = useFormik({
    initialValues: teamMembers.reduce(
      (
        acc: {
          [key: string]: {
            cultureScore: number;
            workScore: number;
            feedbackPositive: string;
            feedbackNegative: string;
          };
        },
        member
      ) => {
        acc[member.id] = memberInitialValues;
        return acc;
      },
      {}
    ),
    validateOnMount: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      return;
    },
  });

  const handleSubmit = async (values: any) => {
    const currentMemberData = values[currentMember.id];
    const assessment = {
      ...currentMemberData,
      contributorId: currentMember.id,
    };
    try {
      const response = await apiAddAssessment(assessment);
      const { data } = response;
      if (data && organization.id) {
        try {
          const roundResponse = await apiGetCurrentRound(organization.id || "");
          if (roundResponse.data) {
            dispatch(setRounds(roundResponse.data));
          }
        } catch (error: any) {
          handleError(error.response.data.message);
        }
      }

      setReviewedMembers([...reviewedMembers, currentMember.id]);
      const nextIncompleteStep = teamMembers.findIndex(
        (member, index) =>
          !reviewedMembers.includes(member.id) && index !== teamMemberIndex
      );

      if (nextIncompleteStep !== -1) {
        setTeamMemberIndex(nextIncompleteStep);
      }
    } catch (error: any) {
      handleError(error.response.data.message);
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
    <div className="flex flex-col gap-2 w-full">
      <CustomSteps
        current={teamMemberIndex}
        onChange={(index) => onStepChange(index)}
        className="mt-4 mb-4"
      >
        {teamMembers.map((member, index) => (
          <CustomSteps.StepItemWithAvatar
            key={index}
            title={member.username}
            avatar={member.profilePicture}
            status={
              reviewedMembers.includes(member.id) ? "complete" : "in-progress"
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
                      formik.values[currentMember.id]?.feedbackPositive || ""
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
                      formik.values[currentMember.id]?.feedbackNegative || ""
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
              Submit
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
  );
};

export default Assess;
