import { useAuth } from "../contexts/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
      <div className="font-bold text-lg">My Projects</div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, {user?.username || "User"}</span>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
