// client/src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../utils/config";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        await login(data.token);
        navigate("/dashboard");
      } else {
        setErr(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // iOS-style spinner loader
  const IOSLoader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="relative w-20 h-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-3 h-6 bg-gray-800 rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translate(0, -28px)`,
              transformOrigin: "center",
              animation: "iosFade 1.2s linear infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>
      <style>
        {`
          @keyframes iosFade {
            0% { opacity: 1; }
            100% { opacity: 0.25; }
          }
        `}
      </style>
    </div>
  );

  return (
    <div className="flex flex-col items-center mt-20 relative">
      {loading && <IOSLoader />}

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
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border mb-3 px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <div className="text-red-500 mb-3">{err}</div>}
        <button
          className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center">
          <Link className="text-blue-600" to="/register">
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
}
