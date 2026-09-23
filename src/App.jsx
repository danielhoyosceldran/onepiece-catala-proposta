import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Chapters from "./pages/Chapters.jsx";
import "./styles/navbar.css";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/capitols" element={<Chapters />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}
