"use client";
import { useState } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");
    
    const payload = {
      title,
      category,
      description,
      imageUrl,
    };
    
    try {
      console.log("Sending request to:", "http://localhost:7071/api/AddProject");
      console.log("Payload:", payload);

      const response = await fetch("http://localhost:7071/api/AddProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response body:", responseText);

      if (response.ok) {
        alert("Project added successfully!");
        setTitle("");
        setCategory("");
        setDescription("");
        setImageUrl("");
      } else {
        alert(`Failed to add project: ${responseText}`);
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(`Error adding project: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Admin Dashboard
        </h1>

        <div className="bg-black/30 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Add New Project</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Full-Stack">Full-Stack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Add Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}