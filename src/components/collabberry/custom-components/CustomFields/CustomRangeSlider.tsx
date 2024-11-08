import React from "react";

interface CustomRangeSliderProps {
  value: number;
  field: string;
  setFieldValue: (field: string, value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const CustomRangeSlider: React.FC<CustomRangeSliderProps> = ({
  value,
  field,
  setFieldValue,
  min = 0,
  max = 100,
  step = 5,
}) => {
  return (
    <div className="w-full flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        name={field}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFieldValue(field, Number(e.target.value))
        }
        className="w-full h-2 bg-berrylavender-100 rounded-lg appearance-none cursor-pointer accent-berrylavender-500"
      />
      <span className="ml-2 text-purple-600">{value}%</span>
    </div>
  );
};

export default CustomRangeSlider;
