import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormContainer, FormItem, Input } from "@/components/ui";
import AvatarImage from "../../../components/collabberry/custom-components/CustomFields/AvatarUpload";
import {
  apiEditOrganization,
} from "@/services/OrgService";
import { OrgState } from "@/store";
import { useDispatch } from "react-redux";
import {
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import { refreshOrganizationData } from "@/services/LoadAndDispatchService";
import { use } from "i18next";
import { useHandleError } from "@/services/HandleError";

const validationSchema = Yup.object().shape({
  logo: Yup.mixed().notRequired(),
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Organization Name is required"),
});

interface EditOrganizationFormProps {
  initialData: OrgState;
  onSubmit: () => void;
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const handleError = useHandleError();

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      logo: initialData?.logo || undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const today = new Date();
      if (today) {
        today.setHours(0, 0, 0, 0);
        const offset = -today.getTimezoneOffset();
        today.setMinutes(today.getMinutes() + offset);
      }
      const dateString = today ? today.toISOString() : null;

      const { contributors, nextRoundDate, roundsActivated, cycle, startDate, teamPointsContractAddress, totalDistributedFiat, totalDistributedTP, ...restOrganization } = initialData as any;
      const body = {
        ...restOrganization,
        ...values,
        compensationStartDay: initialData.compensationStartDay || dateString || undefined,
      };

      if (values?.logo) {
        body.logo = values.logo;
      }

      try {
        const response = await apiEditOrganization(body);
        const { data } = response;
        if (data) {
          refreshOrganizationData(data?.id, dispatch, handleError);
        }

        handleSuccess("You have successfully edited your organization");
        onSubmit();
      } catch (error: any) {
        handleError(error);
        onSubmit();
      }
    },
  });

  return (
    <>
      <FormContainer>
        <h2 className="text-2xl font-bold mb-4 mt-4">
          Edit Organization Details
        </h2>
        <FormItem label="Logo">
          <AvatarImage
            setFieldValue={formik.setFieldValue}
            field="logo"
            value={formik.values.logo || null}
          />
        </FormItem>
        <FormItem label="Organization Name">
          <Input
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
        </FormItem>
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

export default EditOrganizationForm;
