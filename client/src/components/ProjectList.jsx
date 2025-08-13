import { useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects, onDelete, onUpdate, onDeleteAll }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-3">
        {/* <button
          onClick={() => {
            if (confirm("Are you sure you want to delete all projects?")) {
              onDeleteAll();
            }
          }}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          Delete All Projects
        </button> */}

        {/* <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by project name"
          className="border text-sm px-2 py-1 rounded focus:outline-none focus:ring focus:border-blue-300"
        /> */}
      </div>

      
      <div className="max-h-[500px] min-w-[1200px]  overflow-y-auto pr-2">
        {filteredProjects.length > 0 ? (
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-wrap gap-4">
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
