import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";  // ✅ toast container
import { useAuth } from "./contexts/authContext";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#333", color: "#fff" },
        }}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}
