import MovingCirclesBackground from "@/components/collabberry/MovingCirclesBackground";
import Card from "@/components/ui/Card";
import { apiRegisterAccount } from "@/services/AuthService";

import { useEffect } from "react";

const SignUp = () => {
  const mockData = {
    username: "mothson",
    email: "mothy@gmail.com",
  };

  const registerAccount = async () => {
    try {
      const response = await apiRegisterAccount(mockData);
      console.log("Account registered successfully:", response);
    } catch (error) {
      console.error("Error registering account:", error);
    }
  };
  return (
    <>
      <div className="absolute inset-0 z-0">
        <MovingCirclesBackground />
      </div>
      <Card
        className="relative z-10 min-w-[640px] md:min-w-[900px]"
        bodyClass="md:p-10"
      >
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={registerAccount}
        >
          Sign Up
        </button>
      </Card>
    </>
  );
};

export default SignUp;
