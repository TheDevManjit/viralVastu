import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dasboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import WebSettings from "./pages/WebSettings";
import Text from "./pages/Text";
import './App.css'
import { createBrowserRouter, RouterProvider, Route, Routes, createRoutesFromElements } from 'react-router-dom'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
       
       <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Text />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<WebSettings />} />
        </Route>
      </Route>
    </>
  )
);


function App() {


  return (
    <>

      <RouterProvider router={router} />

    </>
  )
}

export default App