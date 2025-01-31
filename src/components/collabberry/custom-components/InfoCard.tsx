import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ReactElement } from "react";
import { HTMLAttributes } from "react";

interface InfoCardProps extends HTMLAttributes<HTMLDivElement> {
  cardContent: ReactElement | string;
  headerIcon?: ReactElement;
  footerAction?: () => void;
  footerButtonTitle?: string;
  footerButtonIcon?: ReactElement;
  step?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({
  footerAction,
  headerIcon,
  footerButtonTitle,
  cardContent,
  step,
  footerButtonIcon,
}) => {
  const hasFooterAction = !!footerAction;
  const cardFooter = hasFooterAction ? (
    <div className="flex justify-center">
      <Button size="sm" className="ltr:mr-2 rtl:ml-2" onClick={footerAction} icon={footerButtonIcon} >
        {footerButtonTitle || "Click here"}
      </Button>
    </div>
  ) : null;

  return (
    <div>
      <Card
        className={`h-full ${step && 'bg-berrylavender-100'} flex flex-col  ${hasFooterAction ? 'justify-between' : 'justify-start'}`}
        header={
          <>
            {headerIcon && (
              <div className="flex items-center justify-center">
                <div style={{ height: "30px", width: "43px" }} className="text-berrylavender-400">{headerIcon}</div>
              </div>
            )}
            {step && (
              <div className="flex items-center justify-center">
                <div className="text-gray-900 text-2xl font-bold">{step}</div>
              </div>
            )}
          </>
        }
        headerClass={`${step && 'p-2 pt-4'}`}
        bodyClass={`${step && 'p-2'}`}
        footerClass={`${step && 'p-2 pb-4'}`}
        footer={cardFooter}
        footerBorder={false}
        headerBorder={false}
      >
        <div className="flex items-center justify-center text-center">
          <div className="p-0">{cardContent}</div>
        </div>
      </Card>
    </div>
  );
};

export default InfoCard;
