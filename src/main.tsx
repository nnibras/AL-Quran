import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";

// HashRouter (not BrowserRouter) so client-side routing works with zero server
// config — a plain drag-and-drop of `dist/` onto Netlify, GitHub Pages, or
// even opening index.html straight from disk all "just work".
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
