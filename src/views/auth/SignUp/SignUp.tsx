import MovingCirclesBackground from "@/components/collabberry/custom-components/MovingCirclesBackground";
import PulsingCirclesBackground from "@/components/collabberry/custom-components/PulsingCirclesBackground";
import {
  Alert,
  Button,
  Dialog,
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
import AvatarImage from "../../../components/collabberry/custom-components/CustomFields/AvatarUpload";
import { useNavigate } from "react-router-dom";
import { RegisterCredential } from "@/@types/auth";
import {
  RootState,
  setAgreement,
  setOrganization,
  setUser,
  signUpSuccess,
} from "@/store";
import {
  apiCreateContributorAgreement,
  apiCreateOrganization,
  apiGetContributorAgreement,
  apiGetOrganizationById,
} from "@/services/OrgService";
import CustomRangeSlider from "@/components/collabberry/custom-components/CustomFields/CustomRangeSlider";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fieldRequired } from "@/components/collabberry/helpers/validations";
import { handleError } from "@/components/collabberry/helpers/ToastNotifications";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { useContractService } from "@/services/ContractsService";
import LottieAnimation from "@/components/collabberry/LottieAnimation";
import * as animationData from "@/assets/animations/clock.json";
import * as successAnimationData from "@/assets/animations/check2.json";
import { shortenTxHash } from "@/components/collabberry/custom-components/TransactionSuccessDialog";
import { environment } from "@/api/environment";
import { ContractResponseStatus } from "@/utils/parseErrorMessage";


const ValidationStepsSchema = Yup.object().shape({
  step1: Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters.")
      .required(fieldRequired),
    email: Yup.string().email("Invalid e-mail.").required(fieldRequired),
    image: Yup.mixed().notRequired(),
  }),
  step2: Yup.object().shape({
    logo: Yup.mixed().notRequired(),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters.")
      .required(fieldRequired),
  }),
  step3: Yup.object().shape({
    roleName: Yup.string().required(fieldRequired),
    responsibilities: Yup.string().required(fieldRequired),
    marketRate: Yup.number().required(fieldRequired).min(1, "Market rate must be at least 1"),
    commitment: Yup.number()
      .min(1, "Commitment must be at least 1%")
      .required(fieldRequired),
    fiatRequested: Yup.number()
      .required(fieldRequired)
      .max(Yup.ref("marketRate"), "Cannot be higher than the market rate.")
      .min(0, "Monetary compensation must be at least 0")
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
    marketRate: "",
    commitment: 50,
    fiatRequested: "",
  },
};

const SignUp = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const organization = useSelector((state: RootState) => state.auth.org);
  const { network, blockExplorer } = environment;
  const dispatch = useDispatch();
  const { deployTeamPoints } = useContractService();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const shortenedTx = useMemo(() => shortenTxHash(txHash ?? '', blockExplorer ?? ''), [txHash, blockExplorer]);


  const formik = useFormik({
    onSubmit: () => { },
    initialValues: initialValues,
    validationSchema: ValidationStepsSchema,
    validateOnMount: true,
  });
  const steps = ["Profile", "Organization", "Agreement"];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (user.id && !user.organization) {
      setCurrentStep(1);
    } else if (user.id && user.organization) {
      setCurrentStep(2)
    } else {
      setCurrentStep(0);
    }
  }, []);


  const createProfile = async () => {
    formik.setSubmitting(true);
    const { username, email, image } = formik.values.step1;
    const data: RegisterCredential = {
      username,
      email,
    };

    if (image) {
      data.profilePicture = image;
    }
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
                profilePicture: user?.profilePicture,
                userName: response?.data?.username,
                authority: response?.data?.isAdmin ? ["ADMIN"] : ["USER"],
                email: response?.data?.email,
                isAdmin: response?.data?.isAdmin,
                organization: response?.data?.organization,
                totalFiat: response?.data?.totalFiat
              })
            );
          }
        } catch (error: any) {
          handleError(error.response.data.message);
        }
      }
      formik.setSubmitting(false);
    } catch (error: any) {
      handleError(error.response.data.message);
      formik.setSubmitting(false);
      return false;
    }
    await formik.validateForm();
    return isStepValid;
  };

  const createOrganization = async () => {
    formik.setSubmitting(true);
    const { name, logo } = formik.values.step2;
    const data: any = {
      name
    };

    if (logo) {
      data.logo = logo;
    }

    try {
      setDialogOpen(true);
      const contractResponse = await deployTeamPoints(data?.name);
      if (contractResponse.status === ContractResponseStatus.Success && contractResponse.data?.contractAddress) {
        if (contractResponse.event?.transactionHash) {
          setTxHash(contractResponse.event?.transactionHash);
          await new Promise((resolve) => setTimeout(resolve, 6000));
        }


        try {
          const orgPostData = {
            ...data,
            teamPointsContractAddress: contractResponse?.data.contractAddress,
          }
          const response = await apiCreateOrganization(orgPostData);
          if (response?.data) {
            try {
              const org = await apiGetOrganizationById(response.data.id);
              if (org.data) {
                dispatch(
                  setOrganization({
                    logo: org?.data?.logo,
                    name: org?.data?.name,
                    id: org?.data?.id,
                    par: org?.data?.par,
                    totalDistributedFiat: org?.data?.totalDistributedFiat,
                    totalDistributedTP: org?.data?.totalDistributedTP,
                    teamPointsContractAddress: org?.data?.teamPointsContractAddress,
                    compensationPeriod: org?.data?.compensationPeriod,
                    compensationStartDay: org?.data?.compensationStartDay,
                    assessmentDurationInDays: org?.data?.assessmentDurationInDays,
                    assessmentStartDelayInDays: org?.data?.assessmentStartDelayInDays,
                    contributors: org?.data?.contributors,

                  })
                );
              }
            } catch (error) {
              console.error("Error getting organization:", error);
            }

            try {
              let response: any = await apiGetUser();
              let user = response?.data || {};
              if (user) {
                dispatch(
                  setUser({
                    id: user.id,
                    profilePicture: user?.profilePicture,
                    userName: response?.data?.username,
                    authority: response?.data?.isAdmin ? ["ADMIN"] : ["USER"],
                    email: response?.data?.email,
                    isAdmin: response?.data?.isAdmin,
                    totalFiat: response?.data?.totalFiat
                  })
                );
              }
            } catch (error) {
              console.error("Error getting user:", error);
            }
          }
          formik.setSubmitting(false);
          setDialogOpen(false);
          formik.setTouched({
            step2: {
              name: true,
              logo: true,
            },
          });
        } catch (error: any) {
          setDialogOpen(false);
          handleError(error.response.data.message);
          formik.setSubmitting(false);
          return false;
        }
      } else {
        handleError("Error deploying Team Points contract");
        formik.setSubmitting(false);
        setDialogOpen(false);
        return false;
      }
    }
    catch (error: any) {
      handleError(error.response.data.message);
      formik.setSubmitting(false);
      return false;
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

              if (organization?.id) {
                try {
                  const org = await apiGetOrganizationById(organization?.id);
                  if (org.data) {
                    dispatch(
                      setOrganization({
                        logo: org?.data?.logo,
                        name: org?.data?.name,
                        id: org?.data?.id,
                        par: org?.data?.par,
                        compensationPeriod: org?.data?.compensationPeriod,
                        compensationStartDay: org?.data?.compensationStartDay,
                        totalDistributedFiat: org?.data?.totalDistributedFiat,
                        totalDistributedTP: org?.data?.totalDistributedTP,
                        teamPointsContractAddress:
                          org?.data?.teamPointsContractAddress,
                        assessmentDurationInDays:
                          org?.data?.assessmentDurationInDays,
                        assessmentStartDelayInDays:
                          org?.data?.assessmentStartDelayInDays,
                        contributors: org?.data?.contributors,
                        roundsActivated: org?.data?.roundsActivated,
                      })
                    );
                  }
                } catch (error) {
                  console.error("Error getting organization:", error);
                }
              }
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

            <FormItem
              label="Profile Picture"
              errorMessage={formik.errors?.step1?.image}
              invalid={
                formik.touched?.step1?.image && !!formik.errors?.step1?.image
              }
            >
              <AvatarImage
                setFieldValue={formik.setFieldValue}
                field="step1.image"
                value={formik.values.step1.image}
              />
            </FormItem>
            <FormItem
              label="Name"
              asterisk
              invalid={
                formik.touched?.step1?.username &&
                !!formik.errors?.step1?.username
              }
              errorMessage={formik.errors?.step1?.username}
            >
              <Input
                name="step1.username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step1.username}
              />
            </FormItem>
            <FormItem
              label="Email"
              asterisk
              invalid={
                formik.touched?.step1?.email && !!formik.errors?.step1?.email
              }
              errorMessage={formik.errors?.step1?.email}
            >
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
          <>
            <Dialog
              isOpen={dialogOpen}
              closable={false}
            >
              <div className=" flex flex-col items-center justify-center p-2 min-h-[200px] relative">
                {txHash ? (
                  <div className="flex flex-col items-center ">
                    <h2 className="text-xl font-bold mb-4 mt-3 text-center">
                      Yay! Your contract has been deployed.
                    </h2>
                    <div className="mb-2 text-center text-md flex flex-col items-center">
                      <p>See your transaction on {network}: </p>
                      <a
                        href={`${blockExplorer}/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-md text-blue-600 underline hover:text-blue-800"
                      >
                        {shortenedTx}
                      </a>
                    </div>

                    <div className="pointer-events-none select-none">
                      <div className="pointer-events-none select-none">
                        {successAnimationData && (
                          <LottieAnimation animationData={successAnimationData} height={150}
                            width={150} />
                        )}
                      </div>
                    </div>
                    <div className="mt-6 text-center text-md flex flex-col items-center ">
                      <p>You will be redirected to the next step in just a few seconds...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center">
                      <h2 className="text-xl font-bold mb-3 mt-3 text-center">
                        Please wait ⏳
                      </h2>

                      <div className="mb-2 text-center text-md flex flex-col items-center">
                        <p >
                          We're working our magic on the blockchain...
                        </p>
                      </div>
                      <div className="pointer-events-none select-none">
                        {animationData && (
                          <LottieAnimation animationData={animationData} height={200}
                            width={200} />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Dialog>
            <FormContainer>
              <h2 className="text-2xl font-bold mb-4 mt-4">
                Create New Organization
              </h2>
              <FormItem
                label="Image"
                invalid={
                  formik.touched?.step2?.logo && !!formik.errors?.step2?.logo
                }
                errorMessage={formik.errors?.step2?.logo}
              >
                <AvatarImage
                  setFieldValue={formik.setFieldValue}
                  field="step2.logo"
                  value={formik.values.step2.logo}
                />
              </FormItem>
              <FormItem
                label="Name"
                asterisk
                invalid={
                  formik.touched?.step2?.name && !!formik.errors?.step2?.name
                }
                errorMessage={formik.errors?.step2?.name}
              >
                <Input
                  name="step2.name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.step2.name}
                />
              </FormItem>
            </FormContainer>


            <div className='text-sm mt-4 items-center text-gray-500 p-1 flex flex-row justify-end'>
              {/* <FiAlertTriangle className='mr-1'/> */}
              <p>By submitting this form, you’ll deploy a new Team Points contract. This transaction will require gas fees.</p>
            </div>
          </>

        );
      case 2:
        return (
          <FormContainer className="max-h-[500px] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 mt-4">
              Your Agreement with the Organization
            </h2>
            <FormItem
              label="Role"
              asterisk
              invalid={
                formik.touched?.step3?.roleName &&
                !!formik.errors?.step3?.roleName
              }
              errorMessage={formik.errors?.step3?.roleName}
            >
              <Input
                name="step3.roleName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step3.roleName}
              />
            </FormItem>

            <FormItem
              label="Responsibilities"
              asterisk
              invalid={
                formik.touched?.step3?.responsibilities &&
                !!formik.errors?.step3?.responsibilities
              }
              errorMessage={formik.errors?.step3?.responsibilities}
            >
              <Input
                name="step3.responsibilities"
                textArea
                rows={3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.step3.responsibilities}
              />
            </FormItem>
            <FormItem
              label="Commitment"
              extra="How much of your time and energy can you provide?"
              asterisk
              invalid={
                formik.touched?.step3?.commitment &&
                !!formik.errors?.step3?.commitment
              }
              errorMessage={formik.errors?.step3?.commitment}
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
                <div className="relative group text-berrylavender-400">
                  <HiOutlineQuestionMarkCircle className="text-lg cursor-pointer ml-1" />{" "}
                </div>
              </Tooltip>
            </div>
            <div className="mb-4 flex-row flex justify-start items-center bg-berrylavender-100 dark:bg-berrylavender-700 gap-1 p-2 rounded-lg">
              <div className="text-berrylavender-700 dark:text-white font-semibold">
                {formik.values.step3?.commitment && !formik.errors.step3?.commitment &&
                  formik.values.step3?.marketRate &&
                  !formik.errors.step3?.marketRate
                  ? `Based on the commitment and market rate, the total compensation is $${(
                    +formik.values.step3?.marketRate *
                    (formik.values.step3.commitment / 100)
                  ).toFixed(0)}.`
                  : "Please input commitment and market rate to calculate the total compensation."}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem
                label="Market Rate"
                extra={
                  "The full-time gross salary you would typically receive in a month."
                }
                asterisk
                invalid={
                  formik.touched?.step3?.marketRate &&
                  !!formik.errors?.step3?.marketRate
                }
                errorMessage={formik.errors?.step3?.marketRate}
              >
                <Input
                  name="step3.marketRate"
                  type="number"
                  prefix="$"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.step3.marketRate}
                />
              </FormItem>
              <FormItem
                label="Monetary Compensation"
                extra={"The monetary compensation you request per month."}
                asterisk
                invalid={
                  formik.touched?.step3?.fiatRequested &&
                  !!formik.errors?.step3?.fiatRequested
                }
                errorMessage={formik.errors?.step3?.fiatRequested}
              >
                <Input
                  name="step3.fiatRequested"
                  type="number"
                  prefix="$"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.step3.fiatRequested}
                />
              </FormItem>
            </div>

            {/* {formik.values.step3.commitment > 10 &&
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
              )} */}
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


