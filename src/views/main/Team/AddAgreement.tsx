import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  FormContainer,
  FormItem,
  Input,
  toast,
  Tooltip,
} from "@/components/ui";
import AvatarImage from "../../../components/collabberry/custom-components/CustomFields/AvatarUpload";
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
import CustomRangeSlider from "@/components/collabberry/custom-components/CustomFields/CustomRangeSlider";
import { FcInfo } from "react-icons/fc";
import {
  HiInformationCircle,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";
import { fieldRequired } from "@/components/collabberry/helpers/validations";

const validationSchema = Yup.object().shape({
  roleName: Yup.string().required(fieldRequired),
  responsibilities: Yup.string().required(fieldRequired),
  marketRate: Yup.number().required(fieldRequired),
  commitment: Yup.number()
    .min(1, "Commitment must be at least 1%")
    .required(fieldRequired),
  fiatRequested: Yup.number()
    .required(fieldRequired)
    .max(Yup.ref("marketRate"), "Cannot be higher than the market rate.")
    .test(
      "is-less-than-market-rate-commitment",
      "Cannot be higher than total compensation",
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
  handleClose: () => void;
}

const AddAgreementForm: React.FC<AddAgreementFormProps> = ({
  contributor,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const organization = useSelector((state: RootState) => state.auth.org);

  const formik = useFormik({
    initialValues: {
      roleName: "",
      responsibilities: "",
      marketRate: null,
      commitment: 50,
      fiatRequested: null,
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
        handleClose();
      } catch (error: any) {
        handleError(error.response.data.message);
        formik.setSubmitting(false);
        handleClose();
      }
    },
  });

  return (
    <>
      <FormContainer
        className="h-90 max-h-[750px] overflow-y-auto"
        style={{ height: "100vh" }}
      >
        <h2 className="text-2xl font-bold mb-4 mt-4">
          Add Agreement for {contributor.username}
        </h2>
        <FormItem
          label="Role"
          asterisk
          invalid={!!formik.errors.roleName && formik.touched.roleName}
          errorMessage={formik.errors.roleName}
        >
          <Input
            name="roleName"
            onChange={formik.handleChange}
            invalid={!!formik.errors.roleName && formik.touched.roleName}
            onBlur={formik.handleBlur}
            value={formik.values.roleName}
          />
        </FormItem>

        <FormItem
          label="Responsibilities"
          asterisk
          invalid={
            !!formik.errors.responsibilities && formik.touched.responsibilities
          }
          errorMessage={formik.errors.responsibilities}
        >
          <Input
            name="responsibilities"
            invalid={
              !!formik.errors.responsibilities &&
              formik.touched.responsibilities
            }
            textArea
            rows={3}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.responsibilities}
          />
        </FormItem>
        <FormItem
          label="Commitment"
          asterisk
          invalid={!!formik.errors.commitment && formik.touched.commitment}
          errorMessage={formik.errors.commitment}

        >
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
            <div className="relative group text-berrylavender-400">
              <HiOutlineQuestionMarkCircle className="text-lg cursor-pointer ml-1" />{" "}
            </div>
          </Tooltip>
        </div>
        <div className="mb-4 flex-row flex justify-start items-center bg-berrylavender-100 dark:bg-berrylavender-700 gap-1 p-2 rounded-lg">
          <div className="text-berrylavender-700 dark:text-white font-semibold">
            {formik.values.commitment &&
            !formik.errors.commitment &&
            formik.values.marketRate &&
            !formik.errors.marketRate
              ? `Based on the commitment and market rate, the total compensation is $${(
                  formik.values.marketRate *
                  (formik.values.commitment / 100)
                ).toFixed(0)}.`
              : "Please input commitment and market rate to calculate the total compensation."}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormItem
            asterisk
            label="Market Rate (per month)"
            invalid={!!formik.errors.marketRate && formik.touched.marketRate}
            errorMessage={formik.errors.marketRate}
          >
            <Input
              name="marketRate"
              type="number"
              prefix="$"
              invalid={!!formik.errors.marketRate && formik.touched.marketRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.marketRate || undefined}
            />
          </FormItem>
          <FormItem
            label="Monetary Compensation (per month)"
            asterisk
            invalid={
              !!formik.errors.fiatRequested && formik.touched.fiatRequested
            }
            errorMessage={formik.errors.fiatRequested }
          >
            <Input
              name="fiatRequested"
              type="number"
              invalid={
                !!formik.errors.fiatRequested && formik.touched.fiatRequested
              }
              prefix="$"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fiatRequested || undefined}
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
      <div className="flex justify-end mt-4 gap-4">
        <Button type="button" onClick={() => handleClose()}>
          Cancel
        </Button>
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
