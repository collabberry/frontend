import CustomSelectTable from "@/components/collabberry/custom-components/CustomTables/CustomSelectTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setReviewedMembers, setSelectedTeamMembers } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { Contributor } from "@/models/Organization.model";
import { Alert, Button, Skeleton } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import CustomAvatarAndUsername from "@/components/collabberry/custom-components/CustomRainbowKit/CustomAvatarAndUsername";
import LottieAnimation from "@/components/collabberry/LottieAnimation";
import * as animationData from "@/assets/animations/tea.json";
import { useEffect } from "react";
import { apiGetAssessmentsByAssessor } from "@/services/OrgService";
import { refreshCurrentRound, refreshOrganizationData } from "@/services/LoadAndDispatchService";

const Assessment = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [submittedAssessments, setSubmittedAssessments] = useState([]);
  const [isRoundLoading, setIsRoundLoading] = useState(false);
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);
  const isLoading = isRoundLoading || isAssessmentLoading;
  const hasRoundAndUserLoaded = useMemo(() => currentRound?.id && user?.id, [currentRound?.id, user?.id]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    dispatch(setSelectedTeamMembers(data));
    dispatch(setReviewedMembers([]));
    navigate("assess");
  };

  useEffect(() => {
    const fetchCurrentRound = async () => {
      setIsRoundLoading(true);
      refreshCurrentRound(dispatch).finally(() => {
        setIsRoundLoading(false);
      }
      )
    }
    fetchCurrentRound();
  }, []);

  useEffect(() => {
    const fetchOrganization = async () => {
      const orgId = user?.organization?.id
      refreshOrganizationData(orgId, dispatch);
    };
    fetchOrganization();
  }, [])



  useEffect(() => {
    if (hasRoundAndUserLoaded) {
      const fetchMyAssessments = async () => {
        try {
          setIsAssessmentLoading(true);
          const assessedByMe = await apiGetAssessmentsByAssessor(
            currentRound?.id,
            user?.id
          );
          setSubmittedAssessments(assessedByMe.data);
        } catch (error) {
        } finally {
          setIsAssessmentLoading(false);
        }
      };
      fetchMyAssessments();
    }
  }, [hasRoundAndUserLoaded]);



  const isTableDisabled = useMemo(() => {
    return currentRound?.status !== RoundStatus.InProgress;
  }, [currentRound]);



  const isContributorDisabled = useCallback((contributor: Contributor) => {
    if (
      !contributor?.agreement ||
      Object.keys(contributor?.agreement).length === 0
    ) {
      return true;
    }
    if (isTableDisabled) {
      return true;
    }

    return submittedAssessments?.some(
      (assessment: { assessedId: string }) =>
        assessment.assessedId === contributor.id
    );
  }, [submittedAssessments, isTableDisabled]);


  const isContributorAlreadyReviewed = useCallback((contributor: Contributor) => {
    return submittedAssessments?.some((assessment: { assessedId: string }) => {
      return assessment.assessedId === contributor.id;
    });
  }, [submittedAssessments]);

  const isCurrentUser = useCallback(
    (contributor: Contributor) => contributor.id === user?.id,
    [user?.id]
  );

  const contributorsWithDisabledFlag = useMemo(() => {
    const filteredContributors = (organization?.contributors || []).reduce(
      (acc, contributor) => {
        if (
          contributor.agreement &&
          Object.keys(contributor.agreement).length > 0 &&
          !isCurrentUser(contributor)
        ) {
          acc.push({
            ...contributor,
            disabled: isContributorDisabled(contributor),
            hasAgreement: true,
            alreadyReviewed: isContributorAlreadyReviewed(contributor),
          });
        }
        return acc;
      },
      [] as any[]
    );
    return filteredContributors;
  }, [organization, submittedAssessments]);

  const isAssessmentDone = useMemo(() => {
    return contributorsWithDisabledFlag.every(
      (contributor) => contributor.alreadyReviewed
    );
  }, [submittedAssessments, contributorsWithDisabledFlag]);

  const columns = useMemo<ColumnDef<Contributor>[]>(() => [
    {
      header: ({ table }) => (
        <div className="flex justify-start">
          <Button
            color="primary"
            className="min-w-[130px]"
            disabled={isTableDisabled}
            onClick={() => {
              const isAllSelected = table.getIsAllRowsSelected();
              table.toggleAllRowsSelected(!isAllSelected);
            }}
          >
            {table.getIsAllRowsSelected() ? "Clear" : "Select All"}
          </Button>
        </div>
      ),
      id: "select",
      accessorKey: "username",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;
        return (
          <CustomAvatarAndUsername
            imageUrl={data?.profilePicture}
            userName={value}
          />
        );
      },
    },
    {
      header: "",
      accessorKey: "agreement.roleName",
    },
  ], [isTableDisabled]);

  return (
    <>
      <div>
        <h1>Assessment</h1>
        {
          isLoading ? (<Skeleton height={56} className="mt-4" />) : (
            <>
              {isTableDisabled ? (
                <Alert showIcon type="info" className="mt-4">
                  <p>
                    There is no ongoing round. You will be able to submit your
                    assessments once the next round starts.
                  </p>
                </Alert>
              ) : isAssessmentDone ? (
                <Alert showIcon type="warning" className="mt-4">
                  <p>
                    It looks like you've already assessed all the members of your team. See you for the next round!
                  </p>
                </Alert>
              ) : (
                <div className="mt-4 text-md font-bold text-gray-500">
                  Select the team members you interacted with last month.
                </div>
              )}
            </>
          )
        }
      </div>

      {isLoading ? (<Skeleton height={200} className="mt-8 mb-8" />) : (
        <>
          {isTableDisabled || isAssessmentDone ? (
            <div className="mt-8 mb-8">
              <LottieAnimation animationData={animationData} />
            </div>
          ) : contributorsWithDisabledFlag.length > 0 && !isAssessmentDone ? (
            <CustomSelectTable
              data={contributorsWithDisabledFlag || []}
              columns={columns}
              onSubmit={onSubmit}
              disabled={isTableDisabled}
            />
          ) : (
            <div className="mt-4 mb-4">
              <Alert showIcon type="danger">
                <p>
                  There are no contributors available for assessment at this time.
                </p>
              </Alert>
            </div>
          )}
        </>
      )}

    </>
  );
};

export default Assessment;
