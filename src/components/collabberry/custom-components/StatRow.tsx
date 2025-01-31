import { Avatar } from "@/components/ui";

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  valueSuffix?: string;
  extraClasses?: string;
  className?: string;
}
export const StatRow = ({ icon, label, value, valueSuffix, extraClasses, className }: StatRowProps) => (
  <div className={`flex items-center gap-2 ${extraClasses}`}>
    <div>
      <Avatar
        size={45}
        className={className}
        icon={icon}
      />
    </div>
    <div>
      <p>{label}</p>
      <h5>
        <span className="leading-none mr-0.5">{value}</span>
        <span className="text-sm leading-none">{valueSuffix}</span>
      </h5>
    </div>
  </div>
);
