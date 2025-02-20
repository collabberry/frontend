import PulsingCirclesBackground from "@/components/collabberry/custom-components/PulsingCirclesBackground";
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Spinner,
  Steps,
} from "@/components/ui";
import Card from "@/components/ui/Card";
import { apiGetUser, apiRegisterAccount } from "@/services/AuthService";
import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import AvatarImage from "../../../components/collabberry/custom-components/CustomFields/AvatarUpload";
import { setOrganization, setUser, signUpSuccess } from "@/store";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appConfig from "@/configs/app.config";
import {
  apiGetOrganizationById,
} from "@/services/OrgService";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { refreshAllRounds, refreshCurrentRound } from "@/services/LoadAndDispatchService";

const ValidationStepsSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  image: Yup.mixed().notRequired(),
  telegramHandle: Yup.string().notRequired(),


});

const initialValues = {
  username: "",
  email: "",
  image: null,
  telegramHandle: "",
};

const SignUpWithInviteLink = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!invitationToken) {
      navigate(appConfig.notRegisteredEntryPath);
    }
  }, [invitationToken]);

  const formik = useFormik({
    onSubmit: async (values) => {
      const { username, email, image, telegramHandle } = values;
      const data: any = {
        username,
        email,
        invitationToken,
      };

      if (image) {
        data.profilePicture = image;
      }

      if (telegramHandle) {
        data.telegramHandle = telegramHandle;
      }
      try {
        const response = await apiRegisterAccount(data);
        if (response?.data) {
          try {
            let response: any = await apiGetUser();
            let user = response?.data || {};
            if (user) {
              if (user?.organization?.id) {
                try {
                  const orgResponse = await apiGetOrganizationById(
                    user.organization.id
                  );
                  dispatch(
                    setOrganization({
                      ...orgResponse?.data,
                      logo: orgResponse?.data?.logo,
                    })
                  );
                } catch (error: any) {
                  handleError(error.response.data.message);
                }

                refreshAllRounds(dispatch);
                refreshCurrentRound(dispatch);


              }
              dispatch(
                setUser({
                  id: user.id,
                  profilePicture: user?.profilePicture,
                  userName: response?.data?.username,
                  authority: ["USER"],
                  email: response?.data?.email,
                  isAdmin: response?.data?.isAdmin,
                  totalFiat: response?.data?.totalFiat,
                  organization: response?.data?.organization,
                })
              );
            }
          } catch (error) { }
        }
        formik.setSubmitting(false);
        dispatch(signUpSuccess(true));
      } catch (error) {
        console.error("Error registering account:", error);
        formik.setSubmitting(false);
      }
    },
    initialValues: initialValues,
    validationSchema: ValidationStepsSchema,
    validateOnMount: true,
  });
  const steps = ["Profile"];
  const [currentStep, setCurrentStep] = useState(0);

  // const handleBack = () => {
  //   setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  // };

  return (
    <>
      <div className="absolute inset-0 z-0">
        <PulsingCirclesBackground />
      </div>
      {invitationToken && (
        <Card
          className="relative z-10 w-full md:w-[600px] min-h-[500px]"
          bodyClass="md:p-10"
        >
          <div>
            {/* step headers */}
            <Steps current={currentStep}>
              {steps.map((step, index) => (
                <Steps.Item
                  key={index}
                  title={step}
                  customIcon={
                    formik.isSubmitting && currentStep === index ? (
                      <Spinner />
                    ) : currentStep > index ? null : undefined
                  }
                />
              ))}
            </Steps>

            <form onSubmit={formik.handleSubmit}>
              <FormContainer>
                <h2 className="text-2xl font-bold mb-4 mt-4">
                  Create Your Profile
                </h2>

                <FormItem label="Your Profile Picture">
                  <AvatarImage
                    setFieldValue={formik.setFieldValue}
                    field="image"
                    value={formik.values.image}
                  />
                </FormItem>
                <FormItem label="Your Name"
                  errorMessage={formik.errors?.username}
                  invalid={
                    formik.touched?.username && !!formik.errors?.username
                  }
                  asterisk
                >
                  <Input
                    name="username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                </FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem label="Email"
                    invalid={
                      formik.touched?.email && !!formik.errors?.email
                    }
                    errorMessage={formik.errors?.email
                    }

                  >
                    <Input
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                  </FormItem>
                  <FormItem
                    label="Telegram Handle"
                    invalid={
                      formik.touched?.telegramHandle && !!formik.errors?.telegramHandle
                    }
                    errorMessage={formik.errors?.telegramHandle}
                  >
                    <Input
                      name="telegramHandle"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.telegramHandle}
                    />
                  </FormItem>

                </div>

              </FormContainer>
              <div className="mt-4 text-right">
                <Button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                  variant="solid"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};

export default SignUpWithInviteLink;
