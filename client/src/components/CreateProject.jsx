import { useState } from "react";

export default function CreateProject({ onCreate }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">

      <h2 className="text-lg font-semibold mb-1">Create New Project</h2>
      <p className="text-sm text-gray-600 mb-4">
        One Business Project is associated with one WhatsApp Business API Number
      </p>


      <div className="flex">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          className="flex-1 border border-gray-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          type="submit"
          className="ml-3 bg-green-900 text-white px-5 py-2 rounded-md text-sm hover:bg-green-800"
        >
          Create
        </button>
      </div>
    </form>
  );
}
