import { RouterProvider } from "react-router-dom";
import router from "./plugins/routers";

function App() {
  return (
    <div className="dark">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
