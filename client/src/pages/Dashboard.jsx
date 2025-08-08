import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreateProject from "../components/CreateProject";
import ProjectList from "../components/ProjectList";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

 
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!token) return navigate("/login");

    fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then(setProjects)
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      });
  }, [token, navigate, BASE_URL]);

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
        setProjects((prev) => [...prev, data.project]);
      } else {
        console.error("Failed to create project:", data.message);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
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
      } else {
        console.error("Failed to update project:", data.message);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects([]);
      } else {
        console.error("Failed to delete all projects");
      }
    } catch (error) {
      console.error("Error deleting all projects:", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto my-6 px-2">
        <CreateProject onCreate={handleCreate} />
        <ProjectList
          projects={projects}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onDeleteAll={handleDeleteAll}
        />
      </main>
    </>
  );
}
