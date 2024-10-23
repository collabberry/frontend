import { useState, useRef, forwardRef, useEffect } from "react";
import useMergedRef from "@/components/ui/hooks/useMergeRef";
import dayjs from "dayjs";
import type {
  FocusEvent,
  KeyboardEvent,
  ChangeEvent,
  ForwardedRef,
  RefObject,
} from "react";
import useControllableState from "@/components/ui/hooks/useControllableState";
import Calendar from "@/components/ui/DatePicker/Calendar";
import { useConfig } from "@/components/ui/ConfigProvider";
import capitalize from "@/components/ui/utils/capitalize";
import { CommonProps } from "@/@types/common";
import { CalendarSharedProps } from "@/components/ui/DatePicker/CalendarBase";
import BasePicker, {
  BasePickerSharedProps,
} from "@/components/ui/DatePicker/BasePicker";

const DEFAULT_INPUT_FORMAT = "YYYY-MM-DD";

export interface DatePickerWithCalendarProps
  extends CommonProps,
    Omit<
      CalendarSharedProps,
      | "onMonthChange"
      | "onChange"
      | "isDateInRange"
      | "isDateFirstInRange"
      | "isDateLastInRange"
      | "month"
    >,
    BasePickerSharedProps {
  closePickerOnChange?: boolean;
  defaultOpen?: boolean;
  defaultValue?: Date | null;
  value?: Date | null;
  inputFormat?: string;
  inputtableBlurClose?: boolean;
  openPickerOnClear?: boolean;
  onChange?: (value: Date | null) => void;
}

const DatePickerWithCalendar = forwardRef<
  HTMLInputElement,
  DatePickerWithCalendarProps
>((props, ref) => {
  const {
    className,
    clearable = true,
    clearButton,
    closePickerOnChange = true,
    dateViewCount,
    dayClassName,
    dayStyle,
    defaultMonth,
    defaultOpen = false,
    defaultValue,
    defaultView,
    disabled = false,
    disableDate,
    enableHeaderLabel,
    disableOutOfMonth,
    firstDayOfWeek = "monday",
    hideOutOfMonthDates,
    hideWeekdays,
    inputFormat,
    inputPrefix,
    inputSuffix,
    inputtable,
    labelFormat = {
      month: "MMM",
      year: "YYYY",
    },
    locale,
    maxDate,
    minDate,
    name = "date",
    onBlur,
    onChange,
    onFocus,
    onDropdownClose,
    onDropdownOpen,
    openPickerOnClear = false,
    renderDay,
    size,
    style,
    type,
    value,
    weekendDays,
    yearLabelFormat,
    ...rest
  } = props;

  const { locale: themeLocale } = useConfig();

  const finalLocale = locale || themeLocale;

  const dateFormat =
    type === "date"
      ? DEFAULT_INPUT_FORMAT
      : inputFormat || DEFAULT_INPUT_FORMAT;

  const inputRef = useRef<HTMLInputElement>(null);

  const [lastValidValue, setLastValidValue] = useState(defaultValue ?? null);

  const [_value, setValue] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange,
  });

  const [calendarMonth, setCalendarMonth] = useState(
    _value || defaultMonth || new Date()
  );

  const [focused, setFocused] = useState(false);

  const [inputState, setInputState] = useState(
    _value instanceof Date
      ? capitalize(dayjs(_value).locale(finalLocale).format(dateFormat))
      : ""
  );

  useEffect(() => {
    if (!_value) {
      if (maxDate && dayjs(calendarMonth).isAfter(maxDate)) {
        setCalendarMonth(maxDate);
      }

      if (minDate && dayjs(calendarMonth).isBefore(minDate)) {
        setCalendarMonth(minDate);
      }
    }
  }, [minDate, maxDate]);

  useEffect(() => {
    if (value === null && !focused) {
      setInputState("");
    }

    if (value instanceof Date && !focused) {
      setInputState(
        capitalize(dayjs(value).locale(finalLocale).format(dateFormat))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, focused, themeLocale]);

  useEffect(() => {
    if (defaultValue instanceof Date && inputState && !focused) {
      setInputState(
        capitalize(dayjs(_value).locale(finalLocale).format(dateFormat))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeLocale]);

  const handleValueChange = (date: Date | null) => {
    setValue(date);
    setInputState(
      capitalize(dayjs(date).locale(finalLocale).format(dateFormat))
    );
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleClear = () => {
    setValue(null);
    setLastValidValue(null);
    setInputState("");
    inputRef.current?.focus();
  };

  const parseDate = (date: string) =>
    dayjs(date, dateFormat, finalLocale).toDate();

  const setDateFromInput = () => {
    let date = typeof _value === "string" ? parseDate(_value) : _value;

    if (maxDate && dayjs(date).isAfter(maxDate)) {
      date = maxDate;
    }

    if (minDate && dayjs(date).isBefore(minDate)) {
      date = minDate;
    }

    if (dayjs(date).isValid()) {
      setValue(date);
      setLastValidValue(date as Date);
      setInputState(
        capitalize(dayjs(date).locale(finalLocale).format(dateFormat))
      );
      setCalendarMonth(date as Date);
    } else {
      setValue(lastValidValue);
    }
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    typeof onBlur === "function" && onBlur(event);
    setFocused(false);

    if (inputtable) {
      setDateFromInput();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputtable) {
      setDateFromInput();
    }
  };

  const handleInputFocus = (event: FocusEvent<HTMLInputElement, Element>) => {
    typeof onFocus === "function" && onFocus(event);
    setFocused(true);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = parseDate(event.target.value);
    if (dayjs(date).isValid()) {
      setValue(date);
      setLastValidValue(date);
      setInputState(event.target.value);
      setCalendarMonth(date);
    } else {
      setInputState(event.target.value);
    }
  };

  return (
    <>
      <BasePicker
        ref={useMergedRef(ref, inputRef)}
        inputtable={inputtable}
        dropdownOpened={false}
        setDropdownOpened={() => {}}
        size={size}
        style={style}
        className={className}
        name={name}
        inputLabel={inputState}
        clearable={type === "date" ? false : clearable && !!_value && !disabled}
        clearButton={clearButton}
        disabled={disabled}
        type={type}
        inputPrefix={inputPrefix}
        inputSuffix={inputSuffix}
        onChange={handleChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        onClear={handleClear}
        onDropdownClose={undefined}
        onDropdownOpen={undefined}
        {...rest}
      ></BasePicker>
      <Calendar
        locale={finalLocale}
        month={inputtable ? calendarMonth : undefined}
        defaultMonth={
          defaultMonth || (_value instanceof Date ? _value : new Date())
        }
        value={
          _value instanceof Date ? _value : _value && dayjs(_value).toDate()
        }
        labelFormat={labelFormat}
        dayClassName={dayClassName}
        dayStyle={dayStyle}
        disableOutOfMonth={disableOutOfMonth}
        minDate={minDate}
        maxDate={maxDate}
        disableDate={disableDate}
        firstDayOfWeek={firstDayOfWeek}
        preventFocus={inputtable}
        dateViewCount={dateViewCount}
        enableHeaderLabel={enableHeaderLabel}
        defaultView={defaultView}
        hideOutOfMonthDates={hideOutOfMonthDates}
        hideWeekdays={hideWeekdays}
        renderDay={renderDay}
        weekendDays={weekendDays}
        yearLabelFormat={yearLabelFormat}
        onMonthChange={setCalendarMonth}
        onChange={handleValueChange}
      />
    </>
  );
});

DatePickerWithCalendar.displayName = "DatePickerWithCalendar";

export default DatePickerWithCalendar;
