import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateProject({ onCreate }) {
  const [name, setName] = useState("");
  const MAX_LENGTH = 36;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    onCreate({ name: name.trim() });
    toast.success("Project created successfully");
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-20 max-w-xl">
      <h2 className="text-lg font-normal mb-1">Create New Project</h2>
      <p className="text-sm text-gray-600 mb-4">
        One Business Project is associated with one WhatsApp Business API Number
      </p>

      <div className="flex flex-col">
        {/* Input field */}
        <input
          type="text"
          value={name}
          maxLength={MAX_LENGTH}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          className="border border-gray-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        {/* Character counter */}
        <div
          className={`text-right text-xs mt-1 ${
            name.length === MAX_LENGTH ? "text-red-500" : "text-gray-500"
          }`}
        >
          {name.length}/{MAX_LENGTH}
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className={`mt-3 h-10 w-full sm:w-40 rounded-md text-xs font-medium transition-colors ${
            !name.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-900 text-white hover:bg-green-800"
          }`}
        >
          Create
        </button>
      </div>
    </form>
  );
}
