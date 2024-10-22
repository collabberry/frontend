import DiffuseRainbowBerrySvg from "@/assets/svg/DiffuseRainbowBerry";
import DreamyBerrySvg from "@/assets/svg/DreamBerry";
import RainbowBerrySvg from "@/assets/svg/RainbowBerry";
import RainbowGradientBerrySvg from "@/assets/svg/RainbowGradientBerry";
import SingleBerrySvg from "@/assets/svg/SingleBerry";

const RatingColors: { [key: number]: string } = {
  1: "#FDDFD9",
  2: "#FABEB2",
  3: "#F7917C",
  4: "#FF7758",
};

interface RatingReviewProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  field: string;
  value: number;
}

function BerryRating({ field, value, setFieldValue }: RatingReviewProps) {
  return (
    <div className="flex flex-row gap-1 mt-2 mb-2">
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <div
            key={star}
            className="start"
            style={{
              cursor: "pointer",
              opacity: value >= star ? "1" : "0.2",
              filter: value >= star ? "grayscale(0%)" : "grayscale(100%)",
              fontSize: `35px`,
            }}
            onClick={() => {
              setFieldValue(field, star);
            }}
          >
            {value === 5 ? (
              <DiffuseRainbowBerrySvg />
            ) : (
              <SingleBerrySvg
                fillColor={
                  RatingColors[value]
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BerryRating;
