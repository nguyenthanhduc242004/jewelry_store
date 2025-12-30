import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Dev-only: surface env values to the console and window for quick inspection
if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__ENV__ = import.meta.env;
  // eslint-disable-next-line no-console
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
