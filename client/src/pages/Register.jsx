import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

export default function Register() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "manager" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Only admins can view this page
  if (user?.role !== "admin") {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Access Denied</h2>
          <p>Only admins can create new users.</p>
        </div>
      </>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/users", form); // ✅ backend route for creating user
      setMessage(`User "${data.name}" created successfully!`);
      setForm({ name: "", email: "", password: "", role: "manager" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <h2>Add New User</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Create User</button>
        </form>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </>
  );
}
