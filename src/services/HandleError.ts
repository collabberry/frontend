import { openToastNotification } from "@/components/collabberry/helpers/ToastNotifications";
import { NotificationPlacement } from "@/components/ui/@types/placement";
import useAuth from "@/utils/hooks/useAuth";

const NOT_AUTHENTICATED_STATUS = 401;

export const useHandleError = () => {
  const { signOut } = useAuth();

  return (error: any, placement = "top-center") => {
    const message = error?.response?.data?.message || error?.message || error;
    const status = error?.response?.status;

    openToastNotification({
      message,
      type: "danger",
      title: "Error",
      placement: placement as NotificationPlacement,
    });

    if (status === NOT_AUTHENTICATED_STATUS) {
      signOut();
    }
  };
};