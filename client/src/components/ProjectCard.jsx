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

      <div className="relative p-4 bg-[#eef7f4] dark:bg-gray-800 rounded shadow flex flex-col gap-2 w-full text-black dark:text-white hover:shadow-lg hover:-translate-y-1 transition duration-300">

        <button
          onClick={() => {
            if (confirm("Delete this project?")) onDelete(project._id);
          }}
          className="absolute top-2 right-2 font-bold hover:text-red-800 text-lg sm:text-sm transition hover:scale-125"
        >
          ✖
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-2 break-words">
          {project.name}
        </h2>


        <div className="flex flex-wrap justify-between gap-3">
          <div className="text-sm min-w-[45%]">
            <span className="text-gray-800 font-semibold block">Status</span>
            <div
              className={
                project.status && project.status !== "Created"
                  ? "text-green-600 font-semibold"
                  : "text-gray-500 font-medium"
              }
            >
              {project.status || "Created"}
            </div>
          </div>

          <div className="text-sm min-w-[45%]">
            <span className="text-gray-500 font-medium block">Active plan</span>
            <div className="text-green-700 font-bold uppercase tracking-wide">
              {project.activePlan || "-"}
            </div>
          </div>
        </div>

        <div className="text-sm">
          <div className="text-gray-800 font-semibold">Number</div>
          <div
            className={
              project.number && project.number !== "N/A"
                ? "text-green-600 font-semibold"
                : "text-gray-500 font-medium"
            }
          >
            {project.number || "N/A"}
          </div>
        </div>


        <p className="text-xs text-gray-400 mb-4">
          Created at {new Date(project.createdAt).toLocaleDateString()}
        </p>


        <button
          onClick={() => setShowViewModal(true)}
          className="w-full border border-gray-300 border-b-green-400 border-t-green-400 rounded-md py-2 text-sm sm:text-base text-gray-800 hover:bg-gray-50"
        >
          View
        </button>
      </div>


      {(showViewModal || showEditModal) && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}


      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white text-black rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-lg relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">Project Details</h2>
            <p><strong>Name:</strong> {project.name}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Plan:</strong> {project.activePlan}</p>
            <p><strong>Number:</strong> {project.number}</p>
            <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</p>

            <div className="mt-4 flex justify-end gap-2 flex-wrap">
              <button
                onClick={() => {
                  setEditData({ ...project });
                  setShowEditModal(true);
                  setShowViewModal(false);
                  setError("");
                }}
                className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}


      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white text-black rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-lg relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-4">Edit Project</h2>

            <input
              className="border p-2 w-full mb-2 rounded"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Name"
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              placeholder="Status"
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              value={editData.activePlan}
              onChange={(e) => setEditData({ ...editData, activePlan: e.target.value })}
              placeholder="Plan"
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              value={editData.number}
              onChange={(e) => setEditData({ ...editData, number: e.target.value })}
              placeholder="Number"
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              onClick={handleEdit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}
