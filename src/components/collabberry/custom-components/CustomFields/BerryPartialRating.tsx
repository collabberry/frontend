import React from "react";
import PartialSingleBerrySvg from "@/assets/svg/PartialBerrySvg";
import AnimatedRainbowBerrySvg from "@/assets/svg/AnimatedRainbowBerry";

interface BerryPartialRatingProps {
    // A rating from 0 to 5 (can include decimals, e.g. 3.4)
    rating: number;
    width?: number;
    height?: number;
}

const BerryPartialRating: React.FC<BerryPartialRatingProps> = ({ rating, width = 20, height = 20 }) => {
    // The original colors for whole–berry ratings (except 5, which uses an animated flair)
    const RatingColors: { [key: number]: string } = {
        1: "#9ca3af",
        2: "#6b7280",
        3: "#F7917C",
        4: "#FF7758",
    };

    // For ratings > 0 take the floor (clamped between 1 and 4) to pick the color.
    const baseRating = rating > 0 ? Math.max(1, Math.min(Math.floor(rating), 4)) : 1;
    const fillColor = RatingColors[baseRating] || "#F7917C";

    return (
        <div className="flex flex-row gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                // If the overall rating is 5, render the animated berry.
                if (rating === 5) {
                    return (
                        <div key={star}>
                            <AnimatedRainbowBerrySvg width={width} height={height} />
                        </div>
                    );
                }

                // Otherwise, calculate the filled portion for this berry.
                // For example, if rating = 3.4 then:
                // star 1: fillPercentage = 1, star 2: fillPercentage = 1, star 3: fillPercentage = 1,
                // star 4: fillPercentage = 0.4, star 5: fillPercentage = 0.
                const starFill = Math.min(1, Math.max(0, rating - (star - 1)));
                return (
                    <div key={star}>
                        <PartialSingleBerrySvg
                            fillPercentage={starFill}
                            fillColor={fillColor}
                            unfilledColor="#e5e7eb"
                            width={width}
                            height={height}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default BerryPartialRating;