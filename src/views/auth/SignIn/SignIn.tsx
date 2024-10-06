import { useState } from "react";
import Card from "@/components/ui/Card";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import { CustomConnectButton } from "@/components/collabberry/CustomConnectButton";
import Dialog from "@/components/ui/Dialog";
import TermsAndConditions from "@/components/collabberry/TermsAndConditions";
import PrivacyPolicy from "@/components/collabberry/PrivacyPolicy";
import Container from "@/components/shared/Container";
import { boolean } from "yup";
import MovingCirclesBackground from "@/components/collabberry/ui-components/MovingCirclesBackground";
import useAuth from "@/utils/hooks/useAuth";
import useTimeOutMessage from "@/utils/hooks/useTimeOutMessage";
import { ActionLink } from "@/components/shared";
import PulsingCirclesBackground from "@/components/collabberry/ui-components/PulsingCirclesBackground";
import { useEffect } from "react";

const SignIn = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const openPrivacyPolicy = () => setIsPrivacyPolicyOpen(true);
  const closePrivacyPolicy = () => setIsPrivacyPolicyOpen(false);
  const [isTermsAndConditionsOpen, setIsTermsAndConditionsOpen] =
    useState(false);
  const openTermsAndConditions = () => setIsTermsAndConditionsOpen(true);
  const closeTermsAndConditions = () => setIsTermsAndConditionsOpen(false);
  const { authenticated, walletConnected } = useAuth();


  const [isChecked, setIsChecked] = useState(true);
  const signUpUrl = "/sign-up";
  const onCheckboxChange = (e: boolean) => {
    setIsChecked(e);
  };



  return (
    <>
      {isTermsAndConditionsOpen && (
        <Dialog
          onClose={closeTermsAndConditions}
          isOpen={isTermsAndConditionsOpen}
        >
          <Container>
            <TermsAndConditions />
          </Container>
        </Dialog>
      )}
      {isPrivacyPolicyOpen && (
        <Dialog onClose={closePrivacyPolicy} isOpen={isPrivacyPolicyOpen}>
          <PrivacyPolicy />
        </Dialog>
      )}

      <div className="absolute inset-0 z-0">
        {/* <MovingCirclesBackground /> */}
        <PulsingCirclesBackground />
      </div>
      <Card
        className="relative z-10 min-w-[320px] md:min-w-[450px]"
        bodyClass="md:p-10"
      >
        <div className="mb-8">
          <h3 className="mb-1">Welcome to the land of berries!</h3>
        </div>

        <div className="flex justify-center mb-8">
          <CustomConnectButton disabled={!isChecked} />
        </div>

        <div className="flex items-start">
          <Checkbox checked={isChecked} onChange={onCheckboxChange} />
          <div className="text-sm flex flex-row space-x-1">
            <span>I agree to the</span>
            <div
              onClick={openTermsAndConditions}
              className="text-primary cursor-pointer underline"
            >
              Terms of Service
            </div>
            <span>and</span>
            <div
              onClick={openPrivacyPolicy}
              className="text-primary cursor-pointer underline"
            >
              Privacy Policy
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SignIn;
