// Polyfills for modern JavaScript features
import "core-js/stable";
import "regenerator-runtime/runtime"; // Polyfill for async/await

import React from "react"; // Ensure React is imported
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Global styles
import App from "./App.jsx"; // Main app component
import UserContext from "./context/UserContext.jsx"; // User context provider

// Render the application
const rootElement = document.getElementById("root");

// Ensure the root element exists
if (!rootElement) {
  console.error("Root element not found. Ensure index.html contains an element with id='root'.");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <UserContext>
        <App />
      </UserContext>
    </StrictMode>
  );
}
