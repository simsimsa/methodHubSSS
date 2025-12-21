import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store, type AppDispatch } from "./store/store.ts";
import { ToastContainer } from "react-toastify";
import { getProfile } from "./store/authSlice";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MaterialDetail from "./pages/MaterialDetail";
import MaterialForm from "./pages/MaterialForm";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/materials/:id",
    element: <MaterialDetail />,
  },
  {
    path: "/materials/new",
    element: <MaterialForm />,
  },
  {
    path: "/materials/:id/edit",
    element: <MaterialForm />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
