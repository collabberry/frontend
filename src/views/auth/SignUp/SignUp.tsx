import MovingCirclesBackground from "@/components/collabberry/custom-components/MovingCirclesBackground";
import PulsingCirclesBackground from "@/components/collabberry/custom-components/PulsingCirclesBackground";
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Spinner,
  Steps,
  Tooltip,
  Upload,
} from "@/components/ui";
import Card from "@/components/ui/Card";
import { apiGetUser, apiRegisterAccount } from "@/services/AuthService";
import { useMemo, useState } from "react";
import { FcImageFile, FcInfo } from "react-icons/fc";
import * as Yup from "yup";
import { useEffect } from "react";
import { Formik, Form, Field, useFormik, useFormikContext } from "formik";
import AvatarImage from "../../../components/collabberry/custom-components/AvatarUpload";
import { useNavigate } from "react-router-dom";
import { RegisterCredential } from "@/@types/auth";
import { setAgreement, setOrganization, setUser, signUpSuccess } from "@/store";
import {
  apiCreateContributorAgreement,
  apiCreateOrganization,
  apiGetContributorAgreement,
  apiGetOrganizationById,
} from "@/services/OrgService";
import CustomRangeSlider from "@/components/collabberry/custom-components/CustomRangeSlider";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { placeholderAvatars } from "@/components/collabberry/helpers/Avatars";

const ValidationStepsSchema = Yup.object().shape({
  step1: Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    image: Yup.mixed().required("Image is required"),
  }),
  step2: Yup.object().shape({
    logo: Yup.mixed().required("Logo is required"),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Organization Name is required"),
  }),
  step3: Yup.object().shape({
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
  }),
});

const initialValues = {
  step1: {
    username: "",
    email: "",
    image: null,
  },
  step2: {
    name: "",
    logo: null,
  },
  step3: {
    roleName: "",
    responsibilities: "",
    marketRate: null,
    commitment: 0,
    fiatRequested: null,
  },
};

const SignUp = () => {
  const user = useSelector((state: any) => state.auth.user);

  const dispatch = useDispatch();
  const formik = useFormik({
    onSubmit: () => {},
    initialValues: initialValues,
    validationSchema: ValidationStepsSchema,
    validateOnMount: true,
  });
  const steps = ["Profile", "Organization", "Agreement"];
  const [currentStep, setCurrentStep] = useState(0);

  const createProfile = async () => {
    formik.setSubmitting(true);
    const { username, email, image } = formik.values.step1;
    const data: RegisterCredential = {
      username,
      email,
      profilePicture: image,
    };
    try {
      const response = await apiRegisterAccount(data);
      if (response?.data) {
        formik.setTouched({
          step1: {
            username: true,
            email: true,
            image: true,
          },
        });
        try {
          let response: any = await apiGetUser();
          let user = response?.data || {};
          if (user) {
            dispatch(
              setUser({
                id: user.id,
                profilePicture: user.profilePicture,
                userName: response.data.username,
                authority: ["USER"],
                email: response.data.email,
              })
            );
          }
        } catch (error) {
          console.error("Error getting user:", error);
        }
      }
      formik.setSubmitting(false);
    } catch (error) {
      console.error("Error registering account:", error);
      formik.setSubmitting(false);
    }
    await formik.validateForm();
    return isStepValid;
  };

  const createOrganization = async () => {
    formik.setSubmitting(true);
    const { name, logo } = formik.values.step2;
    const data = {
      name,
      logo: logo || undefined,
    };

    try {
      const response = await apiCreateOrganization(data);
      if (response?.data) {
        try {
          const org = await apiGetOrganizationById(response.data.id);
          if (org.data) {
            dispatch(
              setOrganization({
                logo: org.data.logo,
                name: org.data.name,
                id: org.data.id,
                par: org.data.par,
                cycle: org.data.cycle,
                startDate: org.data.startDate,
                contributors: org.data.contributors,
              })
            );
          }
        } catch (error) {
          console.error("Error getting organization:", error);
        }
      }
      formik.setSubmitting(false);
      formik.setTouched({
        step2: {
          name: true,
          logo: true,
        },
      });
    } catch (error) {
      console.error("Error creating organization:", error);
      formik.setSubmitting(false);
    }
    await formik.validateForm();
    return isStepValid;
  };

  const createAgreement = async () => {
    formik.setSubmitting(true);
    const {
      roleName,
      responsibilities,
      marketRate,
      commitment,
      fiatRequested,
    } = formik.values.step3;

    if (user.id) {
      const data = {
        userId: user.id,
        roleName,
        responsibilities,
        marketRate,
        commitment,
        fiatRequested,
      };

      try {
        const response = await apiCreateContributorAgreement(data);
        if (response?.data) {
          try {
            const agreement = await apiGetContributorAgreement(user.id);
            if (agreement.data) {
              dispatch(
                setAgreement({
                  marketRate: agreement.data.marketRate,
                  roleName: agreement.data.roleName,
                  responsibilities: agreement.data.responsibilities,
                  fiatRequested: agreement.data.fiatRequested,
                  commitment: agreement.data.commitment,
                })
              );
            }
          } catch (error) {
            console.error("Error getting agreement:", error);
          }
        }
        formik.setSubmitting(false);
        formik.setTouched({
          step3: {
            marketRate: true,
            commitment: true,
            fiatRequested: true,
            roleName: true,
            responsibilities: true,
          },
        });
      } catch (error) {
        console.error("Error creating agreement:", error);
        formik.setSubmitting(false);
      }
    }

    await formik.validateForm();
    return isStepValid;
  };

  const handleSkipAgreement = () => {
    if (currentStep === 2) {
      dispatch(signUpSuccess(true));
    }
  };

  const handleNext = async () => {
    let isStepValid = false;
    if (currentStep === 0) {
      isStepValid = await createProfile();
    } else if (currentStep === 1) {
      isStepValid = await createOrganization();
    } else if (currentStep === 2) {
      isStepValid = await createAgreement();
    }

    if (isStepValid) {
      setCurrentStep((prevStep) => prevStep + 1);
    }

    if (isStepValid && currentStep === 2) {
      dispatch(signUpSuccess(true));
    }
  };

  // const handleBack = () => {
  //   setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  // };

  const getFormForStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <FormContainer>
            <h2 className="text-2xl font-bold mb-4 mt-4">
              Create Your Profile
            </h2>

            <FormItem label="Profile Picture">
              <AvatarImage
                setFieldValue={formik.setFieldValue}
                field="step1.image"
                value={formik.values.step1.image}
              />
            </FormItem>
            <FormItem label="Name">
              <Input
                name="step1.username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step1.username}
              />
            </FormItem>
            <FormItem label="Email">
              <Input
                name="step1.email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step1.email}
              />
            </FormItem>
          </FormContainer>
        );
      case 1:
        return (
          <FormContainer>
            <h2 className="text-2xl font-bold mb-4 mt-4">
              Create New Organization
            </h2>
            <FormItem label="Image">
              <AvatarImage
                setFieldValue={formik.setFieldValue}
                field="step2.logo"
                value={formik.values.step2.logo}
              />
            </FormItem>
            <FormItem label="Name">
              <Input
                name="step2.name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step2.name}
              />
            </FormItem>
          </FormContainer>
        );
      case 2:
        return (
          <FormContainer className="max-h-[400px] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 mt-4">
              Your Agreement with the Organization
            </h2>
            <FormItem label="Role">
              <Input
                name="step3.roleName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step3.roleName}
              />
            </FormItem>

            <FormItem label="Responsibilities">
              <Input
                name="step3.responsibilities"
                textArea
                rows={5}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step3.responsibilities}
              />
            </FormItem>
            <FormItem
              label="Commitment"
              extra="How much of your time and energy can you provide?"
            >
              <CustomRangeSlider
                field="step3.commitment"
                setFieldValue={formik.setFieldValue}
                value={formik.values.step3.commitment}
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
                        Total Compensation = Market Rate ($3,000.00) *
                        Commitment (75%) = $2,250.00
                      </div>
                      <div>
                        Points/Tokens Compensation = Total Compensation
                        ($2,250.00) - Monetary Compensation ($500.00) =
                        $1,750.00
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
              <FormItem
                label="Market Rate"
                extra={
                  "Represents the full-time gross salary you would typically receive"
                }
              >
                <Input
                  name="step3.marketRate"
                  type="number"
                  prefix="$"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.step3.marketRate || ""}
                />
              </FormItem>
              <FormItem
                label="Monetary Compensation"
                extra={"The monetary compensation you request per round"}
              >
                <Input
                  name="step3.fiatRequested"
                  type="number"
                  prefix="$"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.step3.fiatRequested || ""}
                />
              </FormItem>
            </div>

            {formik.values.step3.commitment > 10 &&
              formik.values.step3.marketRate &&
              formik.values.step3.fiatRequested && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <h3 className="text-lg font-bold mb-2">
                    Compensation Calculation
                  </h3>
                  <p>
                    Based on a commitment of{" "}
                    <strong>{formik.values.step3.commitment}%</strong> and a
                    market rate of{" "}
                    <strong>${formik.values.step3.marketRate}</strong>, the
                    total compensation would be{" "}
                    <strong>
                      $
                      {(
                        formik.values.step3.marketRate *
                        (formik.values.step3.commitment / 100)
                      ).toFixed(0)}
                    </strong>
                    .
                  </p>
                  <p>
                    The requested monetary compensation is{" "}
                    <strong>${formik.values.step3.fiatRequested}</strong>,
                    leaving{" "}
                    <strong>
                      $
                      {(
                        formik.values.step3.marketRate *
                          (formik.values.step3.commitment / 100) -
                        formik.values.step3.fiatRequested
                      ).toFixed(0)}
                    </strong>{" "}
                    to be compensated in points/tokens.
                  </p>
                </div>
              )}
          </FormContainer>
        );
      default:
        return null;
    }
  }, [currentStep, formik]);

  const isStepValid = useMemo(() => {
    const errors = (formik.errors as any) || {
      step1: {},
      step2: {},
      step3: {},
    };
    switch (currentStep) {
      case 0:
        return Object.keys(errors?.step1 || {}).length === 0;
      case 1:
        return Object.keys(errors?.step2 || {}).length === 0;
      case 2:
        return Object.keys(errors?.step3 || {}).length === 0;
      default:
        return false;
    }
  }, [currentStep, formik.errors]);

  return (
    <>
      <div className="absolute inset-0 z-0">
        <PulsingCirclesBackground />
      </div>
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
            {getFormForStep}
            <div className="mt-4 text-right">
              {/* <Button
            className="mx-2"
            type="button"
            disabled={currentStep === 0}
            onClick={handleBack}
          >
            Previous
          </Button> */}
              {currentStep === 2 && (
                <Button
                  type="button"
                  onClick={handleSkipAgreement}
                  className="mx-2"
                >
                  Skip for Now
                </Button>
              )}
              <Button
                type="button"
                disabled={
                  currentStep === 3 ||
                  !isStepValid ||
                  formik.isValidating ||
                  !formik.touched ||
                  formik.isSubmitting
                }
                variant="solid"
                onClick={handleNext}
              >
                {currentStep === 3 ? "Completed" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </>
  );
};

export default SignUp;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
