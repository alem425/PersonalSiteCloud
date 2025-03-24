import { useState, useEffect } from "react";

// Project interface that will have an id, title, link and image, taken in from our backend API and put onto the Website display.
interface Project {
    id: string;
    title: string;
    link: string;
    image: string;
}

export default function ProjectList(){
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetch("/api/projects")
          .then((res) => res.json())
          .then((data) => setProjects(data));
      }, []);
    
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <a key={project.id} href={project.link} target="_blank" rel="noopener noreferrer" className="border p-4 rounded-lg shadow">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded" />
              <h2 className="mt-2 text-xl font-semibold">{project.title}</h2>
            </a>
          ))}
        </div>
      );
      
}