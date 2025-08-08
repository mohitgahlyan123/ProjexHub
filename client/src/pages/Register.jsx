import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../utils/config";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok && data.token) {
        login(data.user, data.token);
        navigate("/dashboard");
      } else {
        setErr(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error.message);
      setErr("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <form
        className="max-w-md w-full border rounded p-6 bg-white shadow"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold mb-4">Register</h1>
        <input
          className="w-full border mb-3 px-3 py-2 rounded"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
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
          className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          type="submit"
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <Link className="text-blue-600" to="/login">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
