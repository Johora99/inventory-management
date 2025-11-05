import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./Route/Route";
import AuthProvider from "./AuthProvider/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient()


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
<QueryClientProvider client={queryClient}>
    <AuthProvider>
    <RouterProvider router={router} />,
  </AuthProvider>
</QueryClientProvider>
);