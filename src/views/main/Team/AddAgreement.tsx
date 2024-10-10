import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  toast,
  Tooltip,
} from "@/components/ui";
import AvatarImage from "../../../components/collabberry/custom-components/AvatarUpload";
import {
  apiCreateContributorAgreement,
  apiEditOrganization,
  apiGetContributorAgreement,
  apiGetOrganizationById,
} from "@/services/OrgService";
import { RootState, setOrganization } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  handleError,
  handleSuccess,
  openToastNotification,
} from "@/components/collabberry/helpers/ToastNotifications";
import { on } from "events";
import { Contributor } from "@/models/Organization.model";
import CustomRangeSlider from "@/components/collabberry/custom-components/CustomRangeSlider";
import { FcInfo } from "react-icons/fc";

const validationSchema = Yup.object().shape({
  roleName: Yup.string().required("Role is required"),
  responsibilities: Yup.string().required("Responsibilities are required"),
  marketRate: Yup.number().required("Market rate is required"),
  commitment: Yup.number()
    .min(10, "Commitment must be at least 10")
    .required("Commitment is required"),
  fiatRequested: Yup.number()
    .required("Monetary compensation is required")
    .max(
      Yup.ref("marketRate"),
      "Monetary compensation cannot be higher than the market rate"
    )
    .test(
      "is-less-than-market-rate-commitment",
      "Monetary compensation cannot be higher than total compensation",
      function (value) {
        const { marketRate, commitment } = this.parent;
        return (
          (value ?? 0) === null ||
          (value ?? 0) <= marketRate * (commitment / 100)
        );
      }
    ),
});

interface AddAgreementFormProps {
  contributor: Contributor;
  onSubmit: () => void;
}

const AddAgreementForm: React.FC<AddAgreementFormProps> = ({
  contributor,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const organization = useSelector((state: RootState) => state.auth.org);

  const formik = useFormik({
    initialValues: {
      roleName: "",
      responsibilities: "",
      marketRate: 0,
      commitment: 0,
      fiatRequested: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { id } = contributor;
      formik.setSubmitting(true);
      const {
        roleName,
        responsibilities,
        marketRate,
        commitment,
        fiatRequested,
      } = values;

      const body = {
        userId: id,
        roleName,
        responsibilities,
        marketRate,
        commitment,
        fiatRequested,
      };
      try {
        const response = await apiCreateContributorAgreement(body);
        if (response?.data) {
          try {
            const orgResponse = await apiGetOrganizationById(
              organization.id as string
            );
            if (orgResponse.data) {
              dispatch(setOrganization(orgResponse.data));
            }
          } catch (error: any) {
            handleError(error.response.data.message);
          }
        }
        handleSuccess(`Agreement for ${contributor.username} has been added`);
        formik.setSubmitting(false);
        onSubmit();
      } catch (error: any) {
        handleError(error.response.data.message);
        formik.setSubmitting(false);
        onSubmit();
      }
    },
  });

  return (
    <>
      <FormContainer className="h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 mt-4">
          Add Agreement for {contributor.username}
        </h2>
        <FormItem label="Role">
          <Input
            name="roleName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.roleName}
          />
        </FormItem>

        <FormItem label="Responsibilities">
          <Input
            name="responsibilities"
            textArea
            rows={5}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.responsibilities}
          />
        </FormItem>
        <FormItem label="Commitment">
          <CustomRangeSlider
            field="commitment"
            setFieldValue={formik.setFieldValue}
            value={formik.values.commitment}
          />
        </FormItem>
        <div className="flex items-center mb-4">
          <span className="font-bold">Compensation</span>
          <Tooltip
            title={
              <div>
                <div className="font-bold text-gray-300 mb-2">
                  Calculation Example
                </div>
                <div className="text-gray-300 font-normal">
                  <div>
                    Total Compensation = Market Rate ($3,000.00) * Commitment
                    (75%) = $2,250.00
                  </div>
                  <div>
                    Points/Tokens Compensation = Total Compensation ($2,250.00)
                    - Monetary Compensation ($500.00) = $1,750.00
                  </div>
                  <div>Monetary Compensation = $500.00</div>
                </div>
              </div>
            }
          >
            <div className="ml-2 relative group">
              <FcInfo className="cursor-pointer" />
            </div>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem label="Market Rate">
            <Input
              name="marketRate"
              type="number"
              prefix="$"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.marketRate || ""}
            />
          </FormItem>
          <FormItem label="Monetary Compensation">
            <Input
              name="fiatRequested"
              type="number"
              prefix="$"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fiatRequested || ""}
            />
          </FormItem>
        </div>

        {/* {formik.values.commitment > 10 &&
          formik.values.marketRate &&
          formik.values.fiatRequested && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-bold mb-2">
                Compensation Calculation
              </h3>
              <p>
                Based on a commitment of{" "}
                <strong>{formik.values.commitment}%</strong> and a market rate
                of <strong>${formik.values.marketRate}</strong>, the total
                compensation would be{" "}
                <strong>
                  $
                  {(
                    formik.values.marketRate *
                    (formik.values.commitment / 100)
                  ).toFixed(0)}
                </strong>
                .
              </p>
              <p>
                The requested monetary compensation is{" "}
                <strong>${formik.values.fiatRequested}</strong>, leaving{" "}
                <strong>
                  $
                  {(
                    formik.values.marketRate *
                      (formik.values.commitment / 100) -
                    formik.values.fiatRequested
                  ).toFixed(0)}
                </strong>{" "}
                to be compensated in points/tokens.
              </p>
            </div>
          )} */}
      </FormContainer>
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default AddAgreementForm;
