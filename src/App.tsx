import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "remixicon/fonts/remixicon.css";

import { VideoPlayer } from "./components/VideoPlayer.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VideoPlayer />
  </StrictMode>
);
