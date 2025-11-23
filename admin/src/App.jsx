import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dasboard";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'

function App() {
  return (
    <Routes>

      {/* Default route → login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED ROUTE for dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
