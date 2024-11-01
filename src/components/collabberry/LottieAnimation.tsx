import React from "react";
import Lottie from "react-lottie";
interface LottieAnimationProps {
  animationData: any;
  width?: number;
  height?: number;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  width = 400,
  height = 400,
}) => {
  const defaultOptions = {
    loop: true,
    isClickToPauseDisabled: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  );
};

export default LottieAnimation;
