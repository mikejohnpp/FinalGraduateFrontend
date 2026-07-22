import { RouterProvider } from "react-router-dom";
import router from "./plugins/routers";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "./websocket/chatSocket";
import { CallProvider } from "@/hooks/useWebRTC";
import CallModal from "@/views/messenger/partials/CallModal";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useUserProfile } from "@/hooks/useUser";

function App() {
  const loginSuccess = useSelector((state: RootState) => state.user.loginSuccess);

  useUserProfile();

  useEffect(() => {
    if (loginSuccess) {
      connectSocket();
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [loginSuccess]);

  return (
    <CallProvider>
      <RouterProvider router={router} />
      <CallModal />
      <Toaster position="top-right" richColors />
    </CallProvider>
  );
}

export default App;
