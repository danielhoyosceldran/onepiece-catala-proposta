import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import Landing from "./pages/Landing.jsx";
import "./styles/navbar.css";
import "./styles/install.css";

const Chapters = lazy(() => import("./pages/Chapters.jsx"));

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/capitols"
          element={
            <Suspense fallback={null}>
              <Chapters />
            </Suspense>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
      <InstallPrompt />
    </>
  );
}
