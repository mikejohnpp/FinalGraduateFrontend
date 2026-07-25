import { Outlet } from "react-router-dom";
import TitleManager from "@/components/TitleManager";

export default function RootLayout() {
  return (
    <>
      <TitleManager />
      <Outlet />
    </>
  );
}
