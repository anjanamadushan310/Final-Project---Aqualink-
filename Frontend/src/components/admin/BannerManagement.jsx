import React, { useState } from "react";
import axios from "axios";

export default function BannerAdminForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file);
      setMsg(""); // Clear any previous messages
    } else {
      setSelectedFile(null);
      setMsg("Please select a valid JPEG or PNG image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMsg("Please select an image file.");
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("bannerImage", selectedFile);

      await axios.post("http://localhost:8080/api/banners/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMsg("Banner added successfully!");
      setSelectedFile(null);
      // Reset the file input
      document.getElementById("banner-file-input").value = "";
    } catch (error) {
      setMsg("Failed to add banner. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-10">
      <h2 className="text-lg font-semibold mb-4">Submit New Banner</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select Banner Image (JPEG/PNG)
          </label>
          <input
            id="banner-file-input"
            type="file"
            accept=".jpeg,.jpg,.png"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
        
        {/* Preview the selected image */}
        {selectedFile && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Preview:</label>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Banner preview"
              className="max-w-full h-32 object-cover rounded border"
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={!selectedFile || isLoading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Uploading..." : "Submit Banner"}
        </button>
      </form>
      
      {msg && (
        <div className={`mt-4 ${msg.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {msg}
        </div>
      )}
    </div>
  );
}
