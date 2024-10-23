import { useState } from "react";
import DatePickerWithCalendar from "./CustomFields/DatePickerWithCalendar";

interface CalendarProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  field: string;
  value: string | null;
}
const CustomCalendar: React.FC<CalendarProps> = ({
  setFieldValue,
  field,
  value,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      date.setHours(0, 0, 0, 0);
      const offset = -date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() + offset);
    }
    const dateString = date ? date.toISOString() : null;
    setFieldValue(field, dateString);
  };



  return (
    <div className="w-full">
      <DatePickerWithCalendar
        value={selectedDate}
        onChange={handleDateChange}
        inputFormat="MMM DD, YYYY"
      />
    </div>
  );
};

export default CustomCalendar;
