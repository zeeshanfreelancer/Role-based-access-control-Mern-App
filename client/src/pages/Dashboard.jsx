import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>Welcome, {user?.name}</h1>
        <p>Your role: <strong>{user?.role}</strong></p>

        <div className="dashboard-actions">
          {user?.role === "admin" && (
            <>
              <Link className="dash-btn" to="/products">Manage Products</Link>
              <Link className="dash-btn" to="/add-user">Add Manager</Link>
            </>
          )}

          {user?.role === "manager" && (
            <Link className="dash-btn" to="/products">View/Edit Products</Link>
          )}
        </div>
      </div>
    </>
  );
}
