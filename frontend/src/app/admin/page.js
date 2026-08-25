"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("campusai_token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    setChecking(false);
  }, []);

  const uploadPDF = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("campusai_token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "title",
      title || file.name.replace(/\.pdf$/i, "")
    );

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/documents/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("PDF uploaded successfully!");
      setFile(null);
      setTitle("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="admin-page">
        <div className="admin-card">
          <h1>Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-card">
        <h1>CampusAI Admin</h1>

        <p>
          Upload college documents to the CampusAI
          knowledge base.
        </p>

        <form onSubmit={uploadPDF}>
          <label>Document Title</label>

          <input
            type="text"
            placeholder="CampusAI College Knowledge Base"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Select PDF</label>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) =>
              setFile(e.target.files[0] || null)
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>

        {message && (
          <p className="admin-message">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            marginTop: "15px",
            background: "#667085",
          }}
        >
          Back to Chat
        </button>
      </div>
    </main>
  );
}