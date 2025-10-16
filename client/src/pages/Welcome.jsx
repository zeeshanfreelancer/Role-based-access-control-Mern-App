import { Link } from "react-router-dom";
import "../styles/Welcome.css";

export default function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Welcome to Product Dashboard</h1>
      <p>Select an option to continue:</p>

      <div className="welcome-actions">
        <Link className="welcome-btn" to="/signup">Sign up as Admin</Link>
        <Link className="welcome-btn" to="/login">Login as Admin / Manager</Link>
      </div>
    </div>
  );
}
