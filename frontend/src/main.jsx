import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "../styles.css";
import { Toaster } from 'sonner'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster richColors/>
    <App />
  </StrictMode>
);

