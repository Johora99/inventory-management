import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./Route/Route";



const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);