import { useState } from "react";

export default function ProjectCard({ project, onDelete, onUpdate }) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ ...project });
  const [error, setError] = useState("");

  const handleEdit = () => {
    if (!editData.name?.trim()) {
      setError("Project name is required.");
      return;
    }

    onUpdate(project._id, {
      name: editData.name.trim(),
      status: editData.status,
      activePlan: editData.activePlan,
      number: editData.number,
    });

    setShowEditModal(false);
    setError("");
  };

  return (
    <>
      {/* CARD */}
      <div className="relative p-4 bg-white dark:bg-gray-800 border rounded shadow flex flex-col gap-2 min-w-[250px] text-black dark:text-white hover:shadow-lg hover:-translate-y-1 transition duration-300">
        <button
          onClick={() => {
            if (confirm("Delete this project?")) onDelete(project._id);
          }}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm transition hover:scale-125"
        >
          ❌
        </button>

        <div className="font-semibold">{project.name}</div>
        <div>
          Status:{" "}
          <span className="text-sm text-gray-400">{project.status || "-"}</span>
        </div>
        <div>
          Active Plan:{" "}
          <span className="font-mono">{project.activePlan || "-"}</span>
        </div>
        <div>
          Number:{" "}
          <span className="text-sm text-gray-500">{project.number || "-"}</span>
        </div>
        <div className="text-xs text-gray-400">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </div>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setShowViewModal(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded transition duration-200 hover:bg-blue-700 hover:scale-105 text-sm"
          >
            View
          </button>
          <button
            onClick={() => {
              setEditData({ ...project }); // 🆕 Reset with fresh data
              setShowEditModal(true);
              setError("");
            }}
            className="bg-yellow-600 text-white px-3 py-1 rounded transition duration-200 hover:bg-yellow-700 hover:scale-105 text-sm"
          >
            Edit
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      {(showViewModal || showEditModal) && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-6 max-w-sm w-full shadow-lg relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">Project Details</h2>
            <p><strong>Name:</strong> {project.name}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Plan:</strong> {project.activePlan}</p>
            <p><strong>Number:</strong> {project.number}</p>
            <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-6 max-w-sm w-full shadow-lg relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">Edit Project</h2>

            <input
              className="border p-1 w-full mb-2"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
            />
            <input
              className="border p-1 w-full mb-2"
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              placeholder="Status"
            />
            <input
              className="border p-1 w-full mb-2"
              value={editData.activePlan}
              onChange={(e) =>
                setEditData({ ...editData, activePlan: e.target.value })
              }
              placeholder="Plan"
            />
            <input
              className="border p-1 w-full mb-2"
              value={editData.number}
              onChange={(e) =>
                setEditData({ ...editData, number: e.target.value })
              }
              placeholder="Number"
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}
