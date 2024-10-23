function formatNumber(number: number) {
  if (number < 10) {
    return "0" + number.toString();
  } else {
    return number.toString();
  }
}

interface CustomCountdownProps {
  days: number;
  hours: number;
  minutes: number;
  completed: boolean;
}

export const CustomCountdown = ({
  days,
  hours,
  minutes,
  completed,
}: CustomCountdownProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-row items-end">
        <div className="text-lg text-berrylavender-500 font-bold">{days}</div>
        <div className="text-gray-400 text-lg">D</div>
      </div>
      <div className="flex flex-row items-end">
        <div className="text-lg text-berrylavender-500 font-bold">
          {formatNumber(hours)}
        </div>
        <div className="text-gray-400 text-lg">h</div>
      </div>
      <div className="flex flex-row items-end">
        <div className="text-lg text-berrylavender-500 font-bold">
          {formatNumber(minutes)}
        </div>
        <div className="text-gray-400 text-lg">m</div>
      </div>
    </div>
  );
};
