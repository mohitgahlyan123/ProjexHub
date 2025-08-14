import { useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects, onDelete, onUpdate, onDeleteAll }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mb-3">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete all projects?")) {
              onDeleteAll();
            }
          }}
          className="text-sm text-gray-500 hover:text-red-600 transition w-full sm:w-auto text-left sm:text-center"
        >
          Delete All Projects
        </button>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by project name"
          className="border text-sm px-2 py-1 rounded focus:outline-none focus:ring focus:border-blue-300 w-full sm:w-auto"
        />
      </div>


      <div className="max-h-[500px] overflow-y-auto pr-1">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No projects found.</p>
        )}
      </div>
    </div>
  );
}
