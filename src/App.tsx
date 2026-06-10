import { RouterProvider } from "react-router-dom";
import router from "./plugins/routers";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "./websocket/chatSocket";

function App() {
  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
