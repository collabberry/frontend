import AnimatedRainbowBerrySvg from "@/assets/svg/AnimatedRainbowBerry";
import RainbowBerrySvg from "@/assets/svg/RainbowBerry";
import SingleBerrySvg from "@/assets/svg/SingleBerry";

const RatingColors: { [key: number]: string } = {
  1: "#9ca3af",
  2: "#6b7280",
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
              scale: star === 3 ? "1" : "0.5",
              opacity: value >= star ? "1" : "0.2",
              fontSize: `35px`,
            }}
            onClick={() => {
              setFieldValue(field, star);
            }}
          >
            {value === 5 ? (
              <AnimatedRainbowBerrySvg />
            ) : (
              <SingleBerrySvg fillColor={value >= star ? RatingColors[value] : '#6b7280'} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BerryRating;
