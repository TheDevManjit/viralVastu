import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AxiosInterceptor from "./components/AxiosInterceptor";
import { Outlet } from "react-router-dom";
import ProductUpdate from "./pages/ProductUpdate";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import WebSettings from "./pages/WebSettings";
import React from "react";
import ProductAdd from "./pages/ProductAdd";
import Overview from "./pages/Overview";
import './App.css'
import { createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      <Route element={<AxiosInterceptor><Outlet /></AxiosInterceptor>}>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductUpdate />} />
            <Route path="add-product" element={<ProductAdd />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<WebSettings />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);


function App() {


  return (
    <>

      <RouterProvider router={router} />
      <Toaster />

    </>
  )
}

export default App