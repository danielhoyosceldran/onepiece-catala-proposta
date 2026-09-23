import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ParallaxHero from "../components/ParallaxHero.jsx";
import { groupBySeason } from "../utils/episodes.js";
import { getSeasonImage } from "../utils/seasonImages.js";
import "../styles/landing.css";

export default function Landing() {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    fetch("/data/episodes.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSeasons(groupBySeason(data)))
      .catch(() => setSeasons([]));
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

      {/* <section className="sagas-section">
        <div className="section-heading">
          <span className="section-eyebrow">Mapa del tresor</span>
          <h2 className="section-title">Sagues registrades al diari de bord</h2>
        </div>

        <div className="sagas-scroll">
          {seasons.map((s) => (
            <Link
              key={s.season_number}
              to={`/capitols?season=${s.season_number}`}
              className="saga-card"
            >
              <div
                className="saga-card-bg"
                style={{ backgroundImage: `url(${getSeasonImage(s.season_number)})` }}
                aria-hidden="true"
              />
              <span className="saga-number">{String(s.season_number).padStart(2, "0")}</span>
              <span className="saga-name">{s.season_name}</span>
              <span className="saga-count">{s.episodes.length} episodis</span>
            </Link>
          ))}
          {!seasons.length && <p className="saga-empty">Carregant bitàcola de sagues...</p>}
        </div>
      </section> */}
    </div>
  );
}
