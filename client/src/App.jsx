import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Register from "./pages/Register";
import "./index.css";

function RedirectBasedOnRole() {
  const { user } = useAuth();

  if (!user) return <Welcome />;

  // Redirect based on role
  if (user.role === "admin") return <Navigate to="/dashboard" replace />;
  if (user.role === "manager") return <Navigate to="/dashboard" replace />;

  return <Welcome />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RedirectBasedOnRole />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin routes */}
          <Route
            path="/add-user"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Dashboard (both Admin & Manager) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}