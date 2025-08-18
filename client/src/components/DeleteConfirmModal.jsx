import { useState } from "react";

export default function DeleteConfirmModal({ open, onClose, onConfirm, loading, error, title = "Confirm Delete", description = "Enter your password to confirm.", showDeleteAll = false }) {
  const [password, setPassword] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-4 text-sm text-gray-600">{description}</p>
        <input
          type="password"
          className="border p-2 w-full mb-2 rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          className="bg-red-600 text-white px-4 py-2 rounded w-full mt-2 hover:bg-red-700 transition"
          onClick={() => onConfirm(password)}
          disabled={loading || !password}
        >
          {showDeleteAll ? "Delete All Projects" : "Delete Project"}
        </button>
      </div>
    </div>
  );
}
