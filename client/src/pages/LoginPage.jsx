import React, { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data.user, data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <form
        className="max-w-md w-full border rounded p-6 bg-white shadow"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          type="email"
          className="w-full border mb-3 px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border mb-3 px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-3">{error}</div>}
        <button
          className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          type="submit"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
}
