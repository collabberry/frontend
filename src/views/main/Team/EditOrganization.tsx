import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, FormContainer, FormItem, Input, toast } from "@/components/ui";
import AvatarImage from "../../../components/collabberry/custom-components/AvatarUpload";
import {
  apiEditOrganization,
  apiGetOrganizationById,
} from "@/services/OrgService";
import { setOrganization } from "@/store";
import { useDispatch } from "react-redux";
import {
  handleError,
  handleSuccess,
  openToastNotification,
} from "@/components/collabberry/helpers/ToastNotifications";
import { on } from "events";

const validationSchema = Yup.object().shape({
  logo: Yup.mixed().required("Logo is required"),
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Organization Name is required"),
});

interface EditOrganizationFormProps {
  initialData: any;
  onSubmit: () => void;
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      logo: initialData?.logo || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { contributors, ...restInitialData } = initialData;
      const body = {
        ...restInitialData,
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
            onSubmit();
          }
        }

        handleSuccess("You have successfully edited your community");
        onSubmit();
      } catch (error: any) {
        handleError(error.response.data.message);
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
            value={formik.values.logo}
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
