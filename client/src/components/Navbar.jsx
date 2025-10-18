import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo">Product Dashboard</h2>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="user-role">
              {user.name} ({user.role})
            </span>
            <Link to="/">Dashboard</Link>
            <Link to="/products">Products</Link>
            {user.role === "admin" && <Link to="/add-user">Add User</Link>}
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}