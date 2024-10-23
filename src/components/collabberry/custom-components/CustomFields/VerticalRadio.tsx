import { useState } from "react";
import Radio from "@/components/ui/Radio";

interface RadioOptionProps {
  label: string;
  value: number | string;
}

interface RadioProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  field: string;
  value: string | number | null;
  options: RadioOptionProps[];
}

const VerticalRadio: React.FC<RadioProps> = ({
  setFieldValue,
  field,
  value,
  options,
}) => {
  const onChange = (val: string) => {
    setFieldValue(field, val);
  };

  return (
    <div>
      <div className="mt-4">
        <Radio.Group vertical value={value} onChange={onChange}>
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
};

export default VerticalRadio;
