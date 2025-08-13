// client/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreateProject from "../components/CreateProject";
import ProjectList from "../components/ProjectList";
import BASE_URL from "../utils/config";

export default function Dashboard() {
  const { token, user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const name = user?.username || "User";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if no token
  useEffect(() => {
    if (!token && !loadingUser) navigate("/login");
  }, [token, loadingUser, navigate]);

  // Fetch projects
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
      .then(setProjects)
      .catch(() => setError("Failed to load projects."))
      .finally(() => setLoading(false));
  }, [token]);

  // Create new project
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

  // Delete project
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Update project
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

  // Delete all projects
  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProjects([]);
    } catch (error) {
      console.error("Error deleting all projects:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <h2 className="text-lg font-semibold mb-4">
          Welcome, {name || "User"}
        </h2>

        {/* Create Project Card */}
        <div className="bg-[#E6F2EE] rounded-xl h-60 p-6 flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex-1">
            <CreateProject onCreate={handleCreate} />
          </div>
          <div className="mt-4 md:mt-0 md:ml-8">
            <img
              src="/project-illustration.png"
              alt="Create Project"
              className="w-48 h-auto"
            />
          </div>
        </div>

        {/* Recent Projects */}
        <h3 className="font-medium mb-4">Recent Projects</h3>
        {loading && (
          <div className="text-center text-gray-500">Loading projects...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProjectList
              projects={projects}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onDeleteAll={handleDeleteAll}
            />
          </div>
        )}
      </main>
    </>
  );
}
