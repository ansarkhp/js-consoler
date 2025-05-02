"use client";
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [value, setValue] = useState(() => {
    return localStorage.getItem('js-consoler-code') || "";
  });
  const [fileName, setFileName] = useState(() => {
    return localStorage.getItem('js-consoler-filename') || "newFile.js";
  });

  // Add this effect to save code changes
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('js-consoler-code', value);
      localStorage.setItem('js-consoler-filename', fileName);
    }, 500); // Debounce saves to avoid excessive writes

    return () => clearTimeout(saveTimer);
  }, [value, fileName]);

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
      // Ensure console is visible when running code
    } catch (error) {
      console.error("Error executing code:", error);
      // Ensure console is visible when there's an error
    }
  };

  const buttonStyle = {
    padding: '6px 12px',
    margin: '0 4px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background 0.2s'
  };


  return (
    <div style={{ padding: "1rem", height: "98vh", display: "flex", flexDirection: "column" }}>
      {/* Top Bar with Controls */}
      <div style={{
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5rem",
        padding: "8px",
        backgroundColor: "#2d2d2d",
        borderRadius: "4px"
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="file"
            accept=".js,.txt,.json"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => document.getElementById('file-input').click()}
            style={{
              ...buttonStyle,
              backgroundColor: '#3c3c3c',
              color: 'white'
            }}
          >
            Open File
          </button>

          <span style={{ margin: '0 8px', color: '#aaa' }}>|</span>
          <span style={{ color: '#d4d4d4' }}>{fileName}</span>
        </div>

        <div>
          <button
            onClick={handleSave}
            style={{
              ...buttonStyle,
              backgroundColor: '#3c3c3c',
              color: 'white'
            }}
          >
            Save
          </button>

          <button
            onClick={handleSaveAs}
            style={{
              ...buttonStyle,
              backgroundColor: '#3c3c3c',
              color: 'white'
            }}
          >
            Save As
          </button>

          <button
            onClick={handleRunCode}
            style={{
              ...buttonStyle,
              backgroundColor: '#47A447',
              color: 'white',
            }}
          >
            ▶ Run
          </button>
        </div>
      </div>

      {/* Editor and Console Layout */}
      <div
        id="editor-console-container"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Monaco Editor */}
        <div style={{
          height: "100%",
          transition: "height 0.2s"
        }}>
          <Editor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: "'Consolas', 'Courier New', monospace",
              lineNumbers: "on",
              renderLineHighlight: "all",
              automaticLayout: true
            }}
          />
        </div>



      </div>


    </div>
  );
}
