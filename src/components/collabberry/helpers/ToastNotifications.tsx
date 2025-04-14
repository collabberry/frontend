import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import { Status } from "viem";
import { TypeAttributes } from "@/components/ui/@types/common";
import { NotificationPlacement } from "@/components/ui/@types/placement";


interface OpenNotificationProps {
  title?: string;
  message: string;
  type: TypeAttributes.Status;
  placement?: NotificationPlacement;
}

export const openToastNotification = ({
  type = "info",
  title,
  message,
  placement = "top-end",
}: OpenNotificationProps) => {
  toast.push(
    <Notification
      title={title || type.charAt(0).toUpperCase() + type.slice(1)}
      type={type}
    >
      {message}
    </Notification>,
    {
      placement: placement,
    }
  );
};

export const handleErrorMessage = (error: any, placement = "top-center") => {
  const message = error?.response?.data?.message || error?.message || error;
  openToastNotification({
    message,
    type: "danger",
    title: "Error",
    placement: placement as NotificationPlacement,
  });
};

export const handleInfo = (message: any, placement = "top-center") => {
  openToastNotification({
    message,
    type: "info",
    title: "Info",
    placement: placement as NotificationPlacement,
  });
};

export const handleSuccess = (message: any, placement = "top-center") => {
  openToastNotification({
    message,
    type: "success",
    title: "Success",
    placement: placement as NotificationPlacement,
  });
};
