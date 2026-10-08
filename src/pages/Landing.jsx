import { useEffect } from "react";
import ParallaxHero from "../components/ParallaxHero.jsx";
import "../styles/landing.css";

export default function Landing() {
  useEffect(() => {
    // Warm the player chunk while the visitor looks at the hero.
    const warm = () => import("./Chapters.jsx");
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(warm, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="landing">
      <ParallaxHero />
    </div>
  );
}
