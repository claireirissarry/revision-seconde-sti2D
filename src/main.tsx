import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { AuthProvider } from "./context/AuthContext";
import { FocusModeProvider } from "./context/FocusModeContext";
import { AmbianceAudioProvider } from "./context/AmbianceAudioContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <FocusModeProvider>
            <AmbianceAudioProvider>
              <App />
            </AmbianceAudioProvider>
          </FocusModeProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>
);
