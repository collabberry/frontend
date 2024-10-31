import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ReactElement } from "react";
import { HTMLAttributes } from "react";

interface InfoCardProps extends HTMLAttributes<HTMLDivElement> {
  HeaderIcon?: ReactElement;
  cardContent: ReactElement | string;
  footerAction?: () => void;
  footerButtonTitle?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  HeaderIcon,
  footerAction,
  footerButtonTitle,
  cardContent,
}) => {
  const hasFooterAction = !!footerAction;
  const cardFooter = hasFooterAction ? (
    <div className="flex justify-center">
      <Button size="sm" className="ltr:mr-2 rtl:ml-2" onClick={footerAction}>
        {footerButtonTitle || "Click here"}
      </Button>
    </div>
  ) : null;

  return (
    <div>
      <Card
        className="h-full"
        header={
          HeaderIcon && (
            <div className="flex items-center justify-center">
              <div style={{ height: "40px", width: "40px" }} className="text-berrylavender-400">{HeaderIcon}</div>
            </div>
          )
        }
        footer={cardFooter}
        footerBorder={false}
        headerBorder={false}
      >
        <div className="flex items-center justify-center text-center">
          <div>{cardContent}</div>
        </div>
      </Card>
    </div>
  );
};

export default InfoCard;
