import {
  handleError,
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Dialog,
  FormContainer,
  FormItem,
  Input,
  Radio,
  Spinner,
  Tooltip,
} from "@/components/ui";
import {
  apiEditOrganization,
  apiGetCurrentRound,
  apiGetOrganizationById,
  apiGetRounds,
} from "@/services/OrgService";
import { RootState, setAllRounds, setOrganization, setRounds } from "@/store";
import CustomCalendar from "@/components/collabberry/custom-components/Calendar";
import VerticalRadio from "@/components/collabberry/custom-components/CustomFields/VerticalRadio";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  CompensationPeriod,
  RoundStatus,
} from "@/components/collabberry/utils/collabberry-constants";
import { generateSymbol } from "@/services/ContractsService";

const validationSchema = Yup.object().shape({
  compensationStartDay: Yup.mixed().required("Start date is required"),
  compensationPeriod: Yup.number()
    .integer("The period must be a whole number.")
    .required("This field is required."),
  assessmentStartDelayInDays: Yup.number()
    .integer("The delay must be a whole number.")
    .min(0, "The delay cannot be less than 0 days.")
    .test(
      "is-shorter-than-compensation-period",
      "Delay cannot be longer than compensation period.",
      function (value) {
        const { compensationPeriod } = this.parent;
        const periodDays = {
          [CompensationPeriod.Weekly]: 7,
          [CompensationPeriod.Biweekly]: 14,
          [CompensationPeriod.Monthly]: 30,
          [CompensationPeriod.Quarterly]: 90,
        };

        const compensationPeriodDays =
          periodDays[compensationPeriod as keyof typeof periodDays] || 0;

        return (value ?? 0) <= compensationPeriodDays;
      }
    )
    .required("This field is required."),
  assessmentDurationInDays: Yup.number()
    .integer("The duration must be a whole number.")
    .min(1, "The duration cannot be less than 1 day.")
    .test(
      "is-shorter-than-compensation-period",
      "Duration cannot be longer than compensation period.",
      function (value) {
        const { compensationPeriod } = this.parent;
        const periodDays = {
          [CompensationPeriod.Weekly]: 7,
          [CompensationPeriod.Biweekly]: 14,
          [CompensationPeriod.Monthly]: 30,
          [CompensationPeriod.Quarterly]: 90,
        };

        const compensationPeriodDays =
          periodDays[compensationPeriod as keyof typeof periodDays] || 0;

        return (value ?? 0) <= compensationPeriodDays;
      }
    )
    .required("This field is required."),
  par: Yup.number()
    .integer("The rate must be a whole number.")
    .required("This field is required.")
    .max(100, "The rate cannot exceed 100%")
    .min(0, "The rate cannot be less than 0%"),
  totalFunds: Yup.number()
    .integer("The amount must be a whole number.")
    .required("This field is required.")
    .min(0, "The amount cannot be less than 0")
    .max(10000000, "The amount cannot exceed $10,000,000"),
});

const TextInfoBlock: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-berrylavender-600 font-bold">{value}</h3>
      <span className="text-sm">{title}</span>
    </div>
  );
};

const CompensationSettings: React.FC<any> = () => {
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state: RootState) => state.auth.user);
  const currentRound = useSelector(
    (state: RootState) => state.auth.rounds.currentRound
  );
  const organization = useSelector((state: RootState) => state.auth.org);

  const formik = useFormik({
    initialValues: {
      compensationStartDay: organization?.compensationStartDay,
      compensationPeriod: organization?.compensationPeriod,
      assessmentStartDelayInDays: organization?.assessmentStartDelayInDays,
      assessmentDurationInDays: organization?.assessmentDurationInDays,
      par: organization?.par ? Number(organization.par) : undefined,
      totalFunds: organization?.totalFunds
        ? Number(organization.totalFunds)
        : undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const {
        contributors,
        nextRoundDate,
        roundsActivated,
        cycle,
        startDate,
        totalDistributedFiat,
        totalDistributedTP,
        teamPointsContractAddress,
        ...restOrganization
      } = organization as any;

      const body = {
        ...restOrganization,
        ...values,
      };

      try {
        const response = await apiEditOrganization(body);
        const { data } = response;
        if (data) {
          try {
            const orgResponse = await apiGetOrganizationById(data.id);
            if (orgResponse.data) {
              dispatch(setOrganization(orgResponse.data));
            }
          } catch (error: any) {
            handleError(error.response.data.message);
          }

          try {
            const allRoundsResponse = await apiGetRounds();
            if (allRoundsResponse.data) {
              dispatch(setAllRounds(allRoundsResponse.data));
            }
          } catch (error: any) { }

          try {
            const roundResponse = await apiGetCurrentRound();
            if (roundResponse.data) {
              dispatch(setRounds(roundResponse.data));
            }
          } catch (error: any) { }
        }

        handleSuccess(
          "You have successfully edited the settings of your community"
        );
      } catch (error: any) {
        handleError(error.response.data.message);
      }
    },
  });

  const getCompensationPeriodLabel = (period: CompensationPeriod) => {
    switch (period) {
      case CompensationPeriod.Weekly:
        return "Weekly";
      case CompensationPeriod.Biweekly:
        return "Biweekly";
      case CompensationPeriod.Monthly:
        return "Monthly";
      case CompensationPeriod.Quarterly:
        return "Quarterly";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      {isAdmin ? (
        <Card className="w-3/4">
          <FormContainer>


            <div className="flex flex-col lg:flex-row items-start justify-between">
              <FormItem
                label="Compensation Period"
                asterisk={true}
                errorMessage={formik.errors.compensationPeriod}
                invalid={
                  formik.touched.compensationPeriod &&
                  !!formik.errors.compensationPeriod
                }
                className="w-full lg:w-1/3 "
              >
                <VerticalRadio
                  setFieldValue={formik.setFieldValue}
                  field="compensationPeriod"
                  value={formik.values.compensationPeriod ?? null}
                  options={[
                    // { label: "Weekly", value: CompensationPeriod.Weekly,},  
                    // { label: "Biweekly", value: CompensationPeriod.Biweekly },
                    { label: "Monthly", value: CompensationPeriod.Monthly },
                    // { label: "Quarterly", value: CompensationPeriod.Quarterly },
                  ]}
                />
              </FormItem>
              <FormItem
                label="Compensation Start Date"
                className="w-full lg:w-2/3"
                asterisk={true}
              >
                <DatePicker
                  name="compensationStartDay"
                  value={formik.values.compensationStartDay as any}
                  onChange={(date) =>
                    formik.setFieldValue("compensationStartDay", date)
                  }
                />
                {/* <CustomCalendar
                               setFieldValue={formik.setFieldValue}
                               field="compensationStartDay"
                               value={formik.values.compensationStartDay ?? null}
                             />  */}
              </FormItem>
            </div>
            <div className="text-xl font-semibold text-gray-900 mb-2">
              Assessment Rounds Settings
            </div>
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <FormItem
                label="Assesment Start Delay (in days)"
                className="w-full"
                asterisk={true}
                errorMessage={formik.errors.assessmentStartDelayInDays}
                invalid={
                  formik.touched.assessmentStartDelayInDays &&
                  !!formik.errors.assessmentStartDelayInDays
                }
                extraTooltip="This is the number of days after the compensation period ends that the assessment round will start."
              >
                <Input
                  name="assessmentStartDelayInDays"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.assessmentStartDelayInDays &&
                    !!formik.errors.assessmentStartDelayInDays
                  }
                  value={formik.values.assessmentStartDelayInDays}
                  suffix="days"
                />
              </FormItem>
              <FormItem
                label="Assesment Duration (in days)"
                className="w-full"
                asterisk={true}
                errorMessage={formik.errors.assessmentDurationInDays}
                invalid={
                  formik.touched.assessmentDurationInDays &&
                  !!formik.errors.assessmentDurationInDays
                }
                extraTooltip="This is the number of days the assessment round will last by default."
              >
                <Input
                  name="assessmentDurationInDays"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="number"
                  invalid={
                    formik.touched.assessmentDurationInDays &&
                    !!formik.errors.assessmentDurationInDays
                  }
                  value={formik.values.assessmentDurationInDays}
                  suffix="days"
                />
              </FormItem>
            </div>
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <FormItem
                label="Performance Adjustment Rate"
                className="w-1/2"
                asterisk={true}
                invalid={formik.touched.par && !!formik.errors.par}
                errorMessage={formik.errors.par}
                extraTooltip="This is the minimum or maximum percentage by which the compensation can increase or decrease. We recommend using 20% as a balanced value."
              >
                <Input
                  name="par"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.par}
                  invalid={formik.touched.par && !!formik.errors.par}
                  suffix="%"
                />
              </FormItem>
              <FormItem
                label="Treasury Funds"
                className="w-1/2"
                asterisk={true}
                invalid={
                  formik.touched.totalFunds && !!formik.errors.totalFunds
                }
                errorMessage={formik.errors.totalFunds}
                extraTooltip="This is the amount of money in the treasury that will be used to pay contributors."
              >
                <Input
                  name="totalFunds"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.totalFunds}
                  invalid={
                    formik.touched.totalFunds && !!formik.errors.totalFunds
                  }
                  suffix="$"
                />
              </FormItem>
            </div>
            <div className="mt-2">
              {/* <div className="text-xl font-semibold text-gray-900">
                Compensation Settings
              </div> */}
              {currentRound &&
                currentRound.status === RoundStatus.InProgress && (
                  <Alert showIcon type="warning" className="mt-2">
                    <p>
                      There is an ongoing round. All changes to the compensation
                      settings will take effect in the next round.
                    </p>
                  </Alert>
                )}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="mx-2"
                onClick={() => formik.handleSubmit()}
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Save
              </Button>
            </div>
          </FormContainer>
        </Card>
      ) : (
        <Card className="w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextInfoBlock
              value={
                organization?.compensationPeriod
                  ? `${getCompensationPeriodLabel(
                    organization?.compensationPeriod
                  )}`
                  : "Not Set"
              }
              title="Compensation Period"
            />
            <TextInfoBlock
              value={
                organization?.par
                  ? `${organization.par.toFixed(0)}%`
                  : "Not Set"
              }
              title="Performance Adjustment Rate"
            />
            <TextInfoBlock
              value={
                organization?.compensationStartDay
                  ? new Date(
                    organization.compensationStartDay
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "Not Set"
              }
              title="Compensation Start Date"
            />
            <TextInfoBlock
              value={
                organization?.assessmentStartDelayInDays
                  ? `${organization.assessmentStartDelayInDays} days`
                  : "Not Set"
              }
              title="Assessment Start Delay"
            />
            <TextInfoBlock
              value={
                organization?.assessmentDurationInDays
                  ? `${organization.assessmentDurationInDays} days`
                  : "Not Set"
              }
              title="Assessment Duration"
            />
            <TextInfoBlock
              value={
                organization?.totalFunds
                  ? `$${organization.totalFunds.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`
                  : "Not Set"
              }
              title="Treasury Funds"
            />
          </div>
        </Card>
      )}
    </>
  );
};

export default CompensationSettings;

