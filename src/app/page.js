"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [value, setValue] = useState(""); // Content of the editor
  const [fileName, setFileName] = useState("newFile.js"); // Default file name

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      setFileName(file.name); // Set uploaded file name
      reader.onload = (e) => {
        setValue(e.target.result); // Set file content in the editor
      };
      reader.readAsText(file);
    }
  };

  // Save file with the current file name
  const handleSave = () => {
    saveFile(value, fileName);
  };

  // Save file with a new name (Save As)
  const handleSaveAs = () => {
    const newFileName = prompt("Enter new file name", fileName);
    if (newFileName) {
      setFileName(newFileName); // Update file name
      saveFile(value, newFileName);
    }
  };

  // Function to save the file
  const saveFile = (content, name) => {
    const blob = new Blob([content], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name; // Set file name for download
    link.click();
    URL.revokeObjectURL(link.href);
  };

    // Run JavaScript code in the editor
    const handleRunCode = () => {
      try {
        console.clear();
        console.log("Running code...");
        // Use eval to run the code
        eval(value);
      } catch (error) {
        console.error("Error executing code:", error);
      }
    };

  return (
    <div style={{ padding: "1rem" }}>
      {/* File Upload */}
      <div style={{
        display: 'flex',
        justifyContent:"space-between",
        alignItems:"baseline"
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="file"
            accept=".js,.txt,.json"
            onChange={handleFileUpload}
          />
        </div>

        {/* File Name Display */}
        <div style={{ marginBottom: "1rem" }}>
          <strong>Current File:</strong> {fileName}
        </div>

        {/* Save Buttons */}
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={handleSave} style={{ marginRight: "1rem" }}>
            Save
          </button>
          <button onClick={handleSaveAs}>Save As</button>
        </div>
        <button onClick={handleRunCode} style={{ background: "#28a745", color: "white" }} >Run</button>
      </div>
      {/* Monaco Editor */}
      <Editor
        height="90vh"
        language="javascript"
        theme="vs-dark"
        value={value}
        onChange={(newValue) => setValue(newValue)} // Update editor content
      />
    </div>
  );
}
