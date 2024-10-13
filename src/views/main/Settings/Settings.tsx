import {
  handleError,
  handleSuccess,
} from "@/components/collabberry/helpers/ToastNotifications";
import {
  Button,
  Card,
  FormContainer,
  FormItem,
  Input,
  Radio,
} from "@/components/ui";
import {
  apiEditOrganization,
  apiGetOrganizationById,
} from "@/services/OrgService";
import { RootState, setOrganization } from "@/store";
import CustomCalendar from "@/components/collabberry/custom-components/Calendar";
import VerticalRadio from "@/components/collabberry/custom-components/VerticalRadio";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  startDate: Yup.mixed().required("Start date is required"),
  cycle: Yup.number().required("Compensation Cycle is required"),
  par: Yup.number().required("Performance Adjustment Rate is required"),
});

const Settings: React.FC<any> = () => {
  const dispatch = useDispatch();
  const organization = useSelector((state: RootState) => state.auth.org);

  const formik = useFormik({
    initialValues: {
      startDate: organization?.startDate,
      cycle: organization?.cycle,
      par: organization?.par ? Number(organization.par) : undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { contributors, ...restOrganization } = organization;
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
        }

        handleSuccess(
          "You have successfully edited the settings of your community"
        );
      } catch (error: any) {
        handleError(error.response.data.message);
      }
    },
  });

  return (
    <>
      <h2 className="text-4xl font-bold mb-4">Settings</h2>
      <Card className="w-3/4">
        <FormContainer>
          <div className="flex flex-col lg:flex-row items-start justify-between">
            <FormItem label="Compensation Cycle" className="w-full lg:w-1/3">
              <VerticalRadio
                setFieldValue={formik.setFieldValue}
                field="cycle"
                value={formik.values.cycle ?? null}
                options={[
                  { label: "Weekly", value: 1 },
                  { label: "Biweekly", value: 2 },
                  { label: "Monthly", value: 3 },
                  { label: "Quarterly", value: 4 },
                ]}
              />
            </FormItem>
            <FormItem label="Start Date" className="w-full lg:w-2/3">
              <CustomCalendar
                setFieldValue={formik.setFieldValue}
                field="startDate"
                value={formik.values.startDate ?? null}
              />
            </FormItem>
          </div>
          <div className="flex flex-col lg:flex-row items-start justify-between">
            <FormItem
              label="Performance Adjustment Rate"
              className="w-full"
              extra="This is the minimum or maximum percentage by which the compensation can increase or decrease. We recommend using 20% as a balanced value."
            >
              <Input
                name="par"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.par}
                suffix="%"
              />
            </FormItem>
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
    </>
  );
};

export default Settings;
