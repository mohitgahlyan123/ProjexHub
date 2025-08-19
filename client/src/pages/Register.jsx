import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../utils/config";
import PasswordInput from "../components/PasswordInput";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Client-side validation
    if (name.length < 3 || name.length > 30) {
      setErr("Username must be between 3 and 30 characters");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setErr("Username can only contain letters, numbers, and underscores");
      return;
    }
    if (password.length < 6 || password.length > 128) {
      setErr("Password must be between 6 and 128 characters");
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      setErr("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character");
      return;
    }

    try {
      const result = await register({ username: name, email, password });
      if (result.success) {
        navigate("/dashboard");
      } else {
        setErr(result.error || "Registration failed");
      }
    } catch (error) {
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
        <PasswordInput
          value={password}
          placeholder="Password"
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
