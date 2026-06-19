import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./styles/tailwind.css";
import "./styles/main.scss";
import "./styles/deck-grid.scss";
import "./styles/boot-screen.scss";
import "./styles/perspective-section.scss";
import "./styles/week-celebrations.scss";
import "./styles/navigation-bar.scss";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
