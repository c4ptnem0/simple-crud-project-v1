import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EditAppointmentPage from "./pages/EditAppointmentPage.jsx";
import AntDTheme from "../AntDTheme.json";
import { ConfigProvider } from "antd";

import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/home/edit/:id",
    element: <EditAppointmentPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={AntDTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);
