import CustomSelectTable from "@/components/collabberry/custom-components/CustomTables/CustomSelectTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setReviewedMembers, setSelectedTeamMembers } from "@/store";
import { ColumnDef } from "@tanstack/react-table";
import { Contributor } from "@/models/Organization.model";
import { Avatar } from "@/components/ui";
import { useNavigate } from "react-router-dom";

import { useMemo } from "react";
import { current } from "@reduxjs/toolkit";
import { RoundStatus } from "@/components/collabberry/utils/collabberry-constants";
import { use } from "i18next";
import { is } from "immer/dist/internal";

const Assessment = () => {
  const organization = useSelector((state: RootState) => state.auth.org);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const { submittedAssessments } = currentRound;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    dispatch(setSelectedTeamMembers(data));
    dispatch(setReviewedMembers([]));
    navigate("assess");
  };

  const isTableDisabled = useMemo(() => {
    return currentRound.status !== RoundStatus.InProgress;
  }, [currentRound]);

  const isContributorDisabled = (contributor: Contributor) => {
    if (
      !contributor.agreement ||
      Object.keys(contributor.agreement).length === 0
    ) {
      return true;
    }

    if (isTableDisabled) {
      return true;
    }

    return submittedAssessments.some(
      (assessment: { contributorId: string }) =>
        assessment.contributorId === contributor.id
    );
  };

  const isContributorAlreadyReviewed = (contributor: Contributor) => {
    return submittedAssessments.some(
      (assessment: { contributorId: string }) =>
        assessment.contributorId === contributor.id
    );
  };

  const contributorsWithDisabledFlag = useMemo(() => {
    const contributors =
      organization?.contributors?.map((contributor) => ({
        ...contributor,
        disabled: isContributorDisabled(contributor),
        hasAgreement: contributor.agreement ? Object.keys(contributor.agreement).length > 0 : false,
        alreadyReviewed: isContributorAlreadyReviewed(contributor),
      })) || [];
    return contributors;
  }, [organization, submittedAssessments]);

  console.log(contributorsWithDisabledFlag, "contributorsWithDisabledFlag")

  const columns: ColumnDef<Contributor>[] = [
    {
      header: "",
      accessorKey: "username",
      cell: (props) => {
        const data = props.row.original;
        const value = props.getValue() as string;
        return (
          <div className="flex flex-row items-center justify-start">
            <Avatar className="mr-2 rounded-full" src={data.profilePicture} />
            <span>{value}</span>
          </div>
        );
      },
    },
    {
      header: "",
      accessorKey: "agreement.roleName",
    },
  ];

  return (
    <>
      <div>
        <h1>Assessment</h1>
        <div className="mt-4">
          Select the team members you interacted with last month.
        </div>
      </div>
      {/* <div>
        <ContributorSelectList></ContributorSelectList>
      </div> */}
      <CustomSelectTable
        data={contributorsWithDisabledFlag || []}
        columns={columns}
        onSubmit={onSubmit}
        disabled={isTableDisabled}
      />
    </>
  );
};

export default Assessment;
