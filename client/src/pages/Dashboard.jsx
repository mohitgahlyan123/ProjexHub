import { useState, useEffect } from "react";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreateProject from "../components/CreateProject";
import ProjectList from "../components/ProjectList";
import BASE_URL from "../utils/config";
import CreatePage from "../assets/createpage.png";

export default function Dashboard() {
  const { token, user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const name = user?.username || "User";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, projectId: null, all: false });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!token && !loadingUser) navigate("/login");
  }, [token, loadingUser, navigate]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProjects(data.projects || []))
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleCreate = async ({ name }) => {
    try {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProjects((prev) => [data.project, ...prev]);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };


  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok && data.project) {
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? data.project : p))
        );
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ open: true, projectId: id, all: false });
    setDeleteError("");
  };

  const handleDeleteAll = () => {
    setDeleteModal({ open: true, projectId: null, all: true });
    setDeleteError("");
  };

  const confirmDelete = async (password) => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      let res, data;
      if (deleteModal.all) {
        res = await fetch(`${BASE_URL}/projects`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        });
        data = await res.json();
        if (res.ok) {
          setProjects([]);
          toast.success("All projects deleted successfully!");
          setDeleteModal({ open: false, projectId: null, all: false });
        } else {
          setDeleteError(data.message || "Wrong password or error occurred.");
          toast.error(data.message || "Wrong password or error occurred.");
        }
      } else {
        res = await fetch(`${BASE_URL}/projects/${deleteModal.projectId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        });
        data = await res.json();
        if (res.ok) {
          setProjects((prev) => prev.filter((p) => p._id !== deleteModal.projectId));
          toast.success("Project deleted successfully!");
          setDeleteModal({ open: false, projectId: null, all: false });
        } else {
          setDeleteError(data.message || "Wrong password or error occurred.");
          toast.error(data.message || "Wrong password or error occurred.");
        }
      }
    } catch (error) {
      setDeleteError("Error deleting project.");
      toast.error("Error deleting project.");
    }
    setDeleteLoading(false);
  };
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        <h2 className="text-xl sm:text-2xl font-normal mb-6">Welcome, {name}</h2>

        <div className="bg-[#ebf5f3] rounded-2xl min-h-[20rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex-1 w-full">
            <CreateProject onCreate={handleCreate} />
          </div>
          <div className="flex-shrink-0">
            <img
              src={CreatePage}
              alt="Create Project"
              className="w-40 sm:w-64 h-auto mx-auto md:mx-0"
            />
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-medium mb-6">
          Recent Projects
        </h3>
        {loading && (
          <div className="text-center text-gray-500">Loading projects...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <ProjectList
            projects={projects}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onDeleteAll={handleDeleteAll}
          />
        )}
        <DeleteConfirmModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, projectId: null, all: false })}
          onConfirm={confirmDelete}
          loading={deleteLoading}
          error={deleteError}
          showDeleteAll={deleteModal.all}
        />
      </main>
    </>
  );
}
