"use client";
import { useState, useRef } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [github,setGithub] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('https://mysite-function-app.azurewebsites.net/api/UploadMedia', {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await uploadResponse.json();
      setImageUrl(url); // Store the blob URL
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");

    try {
      // First handle file upload if there's a file selected
      const fileInput = fileInputRef.current;
      let mediaUrl = imageUrl;

      if (fileInput?.files && fileInput.files[0]) {
        mediaUrl = await handleFileUpload(fileInput.files[0]);
      }

      // Then create the project with the blob URL
      const payload = {
        title,
        category,
        description,
        imageUrl: mediaUrl,
        github,
        website,
      };

      const response = await fetch("https://mysite-function-app.azurewebsites.net/api/AddProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Project added successfully!");
        // Reset form
        setTitle("");
        setCategory("");
        setDescription("");
        setImageUrl("");
        setWebsite("");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const responseText = await response.text();
        throw new Error(responseText);
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
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
              <label className="block text-sm font-medium mb-2">GitHub Link</label>
              <input type="text"
              value={github} 
              onChange={(e)=> setGithub(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project Media</label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Preview for images
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (e) => setImageUrl(e.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg hover:bg-black/70 transition-all duration-300"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Choose File'}
                  </button>
                  {imageUrl && imageUrl.startsWith('data:image/') && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste media URL directly"
                  className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
              <label className="block text-sm font-medium mb-2">External Link</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
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