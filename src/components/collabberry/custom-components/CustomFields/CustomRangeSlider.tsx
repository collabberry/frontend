import React from 'react';

interface CustomRangeSliderProps {
    value: number;
    field: string;
    setFieldValue: (field: string, value: number) => void;
}

const CustomRangeSlider: React.FC<CustomRangeSliderProps> = ({ value, field, setFieldValue }) => {

    return (
        <div className="w-full flex items-center">
            <input
                type="range"
                min="0"
                max="100"
                step={5}
                name={field}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(field, Number(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <span className="ml-2 text-purple-600">{value}%</span>
        </div>
    );
};

export default CustomRangeSlider;


