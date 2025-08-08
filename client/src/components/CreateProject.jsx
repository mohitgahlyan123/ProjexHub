import React, { useState } from "react";

export default function CreateProject({ onCreate }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onCreate({ name: trimmedName });
      setName("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded shadow-sm "
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Project Name"
        className="border p-2 rounded w-full sm:w-auto"
        required
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className={`bg-green-600 text-white px-4 py-2 rounded transition 
          ${!name.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
      >
        Create Project
      </button>
    </form>
  );
}

