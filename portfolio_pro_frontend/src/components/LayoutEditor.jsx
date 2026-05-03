import React, { useState } from "react";
import axios from "axios";

// The LayoutEditor takes the current layout settings, a function to update the preview, and the user's email
export default function LayoutEditor({
  currentLayout,
  onPreviewChange,
  userEmail,
}) {
  // State to hold the temporary changes before saving
  const [layout, setLayout] = useState({
    themeColor: currentLayout?.themeColor || "#6366f1",
    backgroundColor: currentLayout?.backgroundColor || "#1a1a2e",
    fontFamily: currentLayout?.fontFamily || "Inter, sans-serif",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle changes to the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newLayout = { ...layout, [name]: value };

    // Update local state
    setLayout(newLayout);

    // Instantly notify the parent component so the preview updates
    onPreviewChange(newLayout);
  };

  // Handle saving the layout to the database
  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      await axios.put("http://localhost:8080/api/portfolio/layout", {
        email: userEmail,
        ...layout,
      });
      setMessage("Layout saved successfully!");

      // Clear the success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to save layout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
        🎨 Customize Layout
      </h3>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Theme Color
        </label>
        <input
          type="color"
          name="themeColor"
          value={layout.themeColor}
          onChange={handleChange}
          style={{
            width: "100%",
            height: "40px",
            padding: "0",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Background Color
        </label>
        <input
          type="color"
          name="backgroundColor"
          value={layout.backgroundColor}
          onChange={handleChange}
          style={{
            width: "100%",
            height: "40px",
            padding: "0",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Font Family
        </label>
        <select
          name="fontFamily"
          value={layout.fontFamily}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2a2a40",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "5px",
          }}
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="'Roboto Mono', monospace">Roboto Mono</option>
          <option value="'Playfair Display', serif">Playfair Display</option>
          <option value="'Comic Sans MS', cursive">
            Comic Sans (Why not?)
          </option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: layout.themeColor, // Button matches their chosen theme!
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Saving..." : "Save Layout"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: message.includes("success")
              ? "rgba(0,200,120,0.1)"
              : "rgba(255,0,0,0.1)",
            color: message.includes("success") ? "#00c878" : "#ff4444",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
