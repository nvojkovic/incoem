import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Calculator from "./Calculator";
import Clients from "./Clients";

const router = createBrowserRouter([
  {
    path: "/calculator",
    element: <Calculator />,
  },

  {
    path: "/",
    element: <Clients />,
  },

  {
    path: "/client/:id",
    element: <Calculator />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
