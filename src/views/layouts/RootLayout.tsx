import { Outlet } from "react-router-dom";
import TitleManager from "@/components/TitleManager";
import { useMessageNotification } from "@/hooks/useMessageNotification";

export default function RootLayout() {
  useMessageNotification();
  return (
    <>
      <TitleManager />
      <Outlet />
    </>
  );
}

