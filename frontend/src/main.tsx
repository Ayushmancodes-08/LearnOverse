import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

try {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render app:", error);
  root.innerHTML = `<div style="padding: 20px; color: red;">
    <h1>Error Loading App</h1>
    <p>${error instanceof Error ? error.message : "Unknown error"}</p>
    <p>Check browser console for details</p>
  </div>`;
}
