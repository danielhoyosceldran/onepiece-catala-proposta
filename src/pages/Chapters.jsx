import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  groupBySeason,
  bountyForEpisode,
  formatBounty,
  synopsisForEpisode,
  getAdjacentEpisode,
  flattenOrdered,
} from "../utils/episodes.js";
import { getProgress, setProgress, getAllProgress } from "../utils/progress.js";
import { resolveMarks } from "../utils/marks.js";
import { getSeasonImage } from "../utils/seasonImages.js";
import "../styles/chapters.css";

const ICON_PROPS = { viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true" };
const S = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

function PlayIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M7 5.2v9.6c0 .6.66 1 1.2.68l7.6-4.8a.8.8 0 0 0 0-1.36l-7.6-4.8A.8.8 0 0 0 7 5.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M4.5 10.5l3.2 3.2L15.5 6.2" {...S} />
    </svg>
  );
}
function StarIcon({ filled, ...props }) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path
        d="M10 3.4l1.85 3.9 4.15.55-3.02 3.02.75 4.33L10 13.2l-3.73 2 .75-4.33-3.02-3.02 4.15-.55L10 3.4Z"
        {...S}
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}
function ChevronIcon({ dir = "right", ...props }) {
  const d = dir === "left" ? "M12 4.5 7 10l5 5.5" : "M8 4.5 13 10l-5 5.5";
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d={d} {...S} />
    </svg>
  );
}
function SkipIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M4.5 5v10l6.5-5-6.5-5Z" fill="currentColor" stroke="none" />
      <path d="M12 5v10" {...S} />
    </svg>
  );
}
function ListCheckIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M4 6h1.6M4 10h1.6M4 14h1.6" {...S} />
      <path d="M8 6h8M8 10h8M8 14h8" {...S} />
    </svg>
  );
}

export default function Chapters() {
  const [episodes, setEpisodes] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [nowPlaying, setNowPlaying] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [seenIds, setSeenIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("opc_seen") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [favIds, setFavIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("opc_favs") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [progressMap, setProgressMap] = useState(() => getAllProgress());
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markEpisodeId, setMarkEpisodeId] = useState(null);
  const [showSeasonModal, setShowSeasonModal] = useState(false);

  const videoRef = useRef(null);
  const marksRef = useRef({ introEnd: 170 });
  const lastSavedTimeRef = useRef(0);

  const recordProgress = (ep, time, duration) => {
    const result = setProgress(ep.episode_id, { time, duration });
    setProgressMap((prev) => ({ ...prev, [ep.episode_id]: result }));
    if (result.completed) {
      setSeenIds((prev) => {
        if (prev.has(ep.episode_id)) return prev;
        const next = new Set(prev).add(ep.episode_id);
        localStorage.setItem("opc_seen", JSON.stringify([...next]));
        return next;
      });
    }
  };

  const openEpisode = (ep) => {
    lastSavedTimeRef.current = 0;
    marksRef.current = { introEnd: 170 };
    setShowSkipIntro(false);
    setNowPlaying(ep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadedMetadata = (e) => {
    const video = e.target;
    const duration = video.duration || 0;
    marksRef.current = { introEnd: resolveMarks(nowPlaying.episode_id, duration).introEnd };
    const saved = getProgress(nowPlaying.episode_id);
    if (saved && !saved.completed && saved.time > 0 && saved.time < duration - 5) {
      video.currentTime = saved.time;
    }
    setShowSkipIntro(video.currentTime < marksRef.current.introEnd);
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    const t = video.currentTime;
    const duration = video.duration || 0;

    setShowSkipIntro(t < marksRef.current.introEnd);

    if (t - lastSavedTimeRef.current >= 5) {
      lastSavedTimeRef.current = t;
      recordProgress(nowPlaying, t, duration);
    }
  };

  const handleEnded = () => {
    if (!nowPlaying || !videoRef.current) return;
    const duration = videoRef.current.duration || 0;
    recordProgress(nowPlaying, duration, duration);
  };

  const skipIntro = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = marksRef.current.introEnd;
    setShowSkipIntro(false);
  };

  const toggleSeen = (episodeId) => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      next.has(episodeId) ? next.delete(episodeId) : next.add(episodeId);
      localStorage.setItem("opc_seen", JSON.stringify([...next]));
      return next;
    });
  };

  const toggleFav = (episodeId) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.has(episodeId) ? next.delete(episodeId) : next.add(episodeId);
      localStorage.setItem("opc_favs", JSON.stringify([...next]));
      return next;
    });
  };

  const openMarkModal = () => {
    setMarkEpisodeId(heroInfo?.episode.episode_id ?? null);
    setShowMarkModal(true);
  };

  const confirmMarkProgress = () => {
    const ordered = flattenOrdered(episodes);
    const chosen = ordered.find((e) => e.episode_id === markEpisodeId);
    if (!chosen) return;
    const next = new Set(
      ordered.filter((e) => e.episode_absolute <= chosen.episode_absolute).map((e) => e.episode_id)
    );
    setSeenIds(next);
    localStorage.setItem("opc_seen", JSON.stringify([...next]));
    setShowMarkModal(false);
  };

  const activeSeason = Number(searchParams.get("season")) || null;

  useEffect(() => {
    fetch("/data/episodes.json")
      .then((res) => {
        if (!res.ok) throw new Error("No s'ha pogut carregar episodes.json");
        return res.json();
      })
      .then((data) => setEpisodes(data))
      .catch((err) => setError(err.message));
  }, []);

  const seasons = useMemo(() => groupBySeason(episodes), [episodes]);

  // Primer cop a Capitols: obre directament el modal "Marcar vist / no vist".
  useEffect(() => {
    if (!episodes.length) return;
    if (localStorage.getItem("opc_mark_modal_intro_shown")) return;
    localStorage.setItem("opc_mark_modal_intro_shown", "1");
    openMarkModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes]);

  // "Continuar veient": episodi amb l'`updatedAt` més recent a opc_progress.
  // Si ja està completat, es proposa el següent. Si no hi ha cap progrés, es
  // proposa el primer episodi de la sèrie ("Començar a veure").
  const heroInfo = useMemo(() => {
    if (!episodes.length) return null;

    const entries = Object.entries(progressMap).sort(
      (a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0)
    );

    for (const [episodeIdStr, data] of entries) {
      const ep = episodes.find((e) => String(e.episode_id) === episodeIdStr);
      if (!ep) continue;
      if (data.completed) {
        const next = getAdjacentEpisode(episodes, ep.episode_id, 1);
        if (next) return { episode: next, mode: "start", progress: null };
        return { episode: ep, mode: "rewatch", progress: data };
      }
      return { episode: ep, mode: "resume", progress: data };
    }

    const first = episodes.find((e) => e.episode_absolute === 1) || episodes[0];
    return { episode: first, mode: "start", progress: null };
  }, [episodes, progressMap]);

  // Selecciona per defecte la saga de l'episodi destacat, un cop es coneix.
  useEffect(() => {
    if (heroInfo && !searchParams.get("season")) {
      setSearchParams({ season: String(heroInfo.episode.season_number) }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroInfo]);

  const filteredEpisodes = useMemo(() => {
    const season = seasons.find((s) => s.season_number === activeSeason);
    const base = season ? season.episodes : [];
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return episodes.filter(
      (ep) =>
        ep.season_name.toLowerCase().includes(q) ||
        String(ep.episode_absolute).includes(q) ||
        ep.filename.toLowerCase().includes(q)
    );
  }, [seasons, activeSeason, query, episodes]);

  const selectSeason = (seasonNumber) => {
    setQuery("");
    setSearchParams({ season: String(seasonNumber) });
  };

  if (error) {
    return (
      <div className="chapters-shell centered">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  const heroProgressPercent =
    heroInfo?.progress && heroInfo.progress.duration > 0
      ? Math.min(100, (heroInfo.progress.time / heroInfo.progress.duration) * 100)
      : 0;
  const heroRemainingMinutes =
    heroInfo?.mode === "resume" && heroInfo.progress
      ? Math.max(1, Math.round((heroInfo.progress.duration - heroInfo.progress.time) / 60))
      : null;
  const heroButtonLabel = heroInfo?.mode === "resume" ? "Reprendre" : "Reproduir";
  const heroKicker =
    heroInfo?.mode === "resume"
      ? "Continua veient"
      : heroInfo?.mode === "rewatch"
      ? "Ho has acabat tot"
      : "Comença a veure";

  return (
    <div className="chapters-shell">
      <main className="content">
        {heroInfo && (
          <section
            className="chapters-hero"
            style={
              getSeasonImage(activeSeason ?? heroInfo.episode.season_number)
                ? { "--hero-bg-image": `url("${getSeasonImage(activeSeason ?? heroInfo.episode.season_number)}")` }
                : undefined
            }
          >
            <div className={"hero-frame" + (nowPlaying ? " is-playing" : "")}>
              {nowPlaying ? (
                <div className="player-panel">
                  <video
                    key={nowPlaying.episode_id}
                    ref={videoRef}
                    className="player-video"
                    src={nowPlaying.video_url}
                    controls
                    autoPlay
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                  />

                  <div className="player-bar-outside">
                    <span className="player-title">
                      {nowPlaying.season_name} · Episodi {nowPlaying.episode_in_season}
                    </span>
                    <div className="player-controls">
                      <button
                        type="button"
                        className="player-chip"
                        disabled={!getAdjacentEpisode(episodes, nowPlaying.episode_id, -1)}
                        onClick={() => {
                          const prev = getAdjacentEpisode(episodes, nowPlaying.episode_id, -1);
                          if (prev) openEpisode(prev);
                        }}
                        aria-label="Episodi anterior"
                      >
                        <ChevronIcon dir="left" /> Anterior
                      </button>
                      {showSkipIntro && (
                        <button type="button" className="player-chip" onClick={skipIntro}>
                          <SkipIcon /> Saltar intro
                        </button>
                      )}
                      <button
                        type="button"
                        className="player-chip"
                        disabled={!getAdjacentEpisode(episodes, nowPlaying.episode_id, 1)}
                        onClick={() => {
                          const next = getAdjacentEpisode(episodes, nowPlaying.episode_id, 1);
                          if (next) openEpisode(next);
                        }}
                        aria-label="Episodi següent"
                      >
                        Següent <ChevronIcon dir="right" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chapters-hero-content">
                  <span className="hero-kicker">{heroKicker}</span>
                  <h1 className="chapters-hero-title">{heroInfo.episode.season_name}</h1>
                  <p className="hero-ep-line">
                    Episodi {heroInfo.episode.episode_in_season} · #{heroInfo.episode.episode_absolute}
                  </p>

                  <button
                    type="button"
                    className="hero-play-button"
                    onClick={() => openEpisode(heroInfo.episode)}
                  >
                    <PlayIcon className="hero-play-icon" /> {heroButtonLabel}
                  </button>

                  {heroProgressPercent > 0 && (
                    <div className="hero-progress-track">
                      <div className="hero-progress-fill" style={{ width: `${heroProgressPercent}%` }} />
                    </div>
                  )}
                  {heroRemainingMinutes !== null && (
                    <p className="hero-remaining">Queden {heroRemainingMinutes} min</p>
                  )}

                  <p className="hero-synopsis">{synopsisForEpisode(heroInfo.episode)}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="episodes-section">
          <div className="episodes-header">
            <h2 className="episodes-title">Episodis</h2>

            <div className="episodes-header-controls">
              <button
                type="button"
                className="mark-progress-button"
                onClick={openMarkModal}
              >
                <ListCheckIcon /> Marcar vist / no vist
              </button>

              <label className="search-field compact">
                <svg className="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="13.2" y1="13.2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Cerca episodi o saga..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>

              <button
                type="button"
                className="season-trigger"
                onClick={() => setShowSeasonModal(true)}
                disabled={!!query}
              >
                {activeSeason
                  ? `Saga ${String(activeSeason).padStart(2, "0")} · ${
                      seasons.find((s) => s.season_number === activeSeason)?.season_name ?? ""
                    }`
                  : "Selecciona una saga"}
              </button>
            </div>
          </div>

          <p className="episodes-stats">
            {episodes.length} episodis · Vídeos servits per{" "}
            <a href="https://onepiece.xarxacatala.cat/" target="_blank" rel="noreferrer noopener">
              onepiece.xarxacatala.cat
            </a>
          </p>

          <div className="episode-list">
            {filteredEpisodes.map((ep) => {
              const isSeen = seenIds.has(ep.episode_id);
              const isFav = favIds.has(ep.episode_id);
              const progress = progressMap[ep.episode_id];
              const progressPercent =
                progress && progress.duration > 0
                  ? Math.min(100, (progress.time / progress.duration) * 100)
                  : 0;
              const isPlaying = nowPlaying?.episode_id === ep.episode_id;
              return (
                <article
                  key={ep.episode_id}
                  className={
                    "episode-row" + (isSeen ? " is-seen" : "") + (isPlaying ? " is-playing" : "")
                  }
                  onClick={() => openEpisode(ep)}
                >
                  <span className="episode-row-index">{ep.episode_in_season}</span>

                  <div className="episode-row-thumb">
                    <PlayIcon className="episode-row-play" />
                    {progressPercent > 0 && !isSeen && (
                      <div className="wanted-progress">
                        <div className="wanted-progress-fill" style={{ width: `${progressPercent}%` }} />
                      </div>
                    )}
                  </div>

                  <div className="episode-row-body">
                    <div className="episode-row-title-line">
                      <h3 className="episode-row-title">Episodi {ep.episode_in_season} - {ep.episode_absolute}</h3>
                      {isSeen && (
                        <span className="episode-row-seen">
                          <CheckIcon /> Vist
                        </span>
                      )}
                    </div>
                    <p className="episode-row-synopsis">{synopsisForEpisode(ep)}</p>
                  </div>

                  <div className="episode-row-actions" onClick={(e) => e.stopPropagation()}>
                    {/* <span className="episode-row-bounty">฿ {formatBounty(bountyForEpisode(ep))}</span> */}
                    <button
                      type="button"
                      className={"wanted-action" + (isSeen ? " active" : "")}
                      onClick={() => toggleSeen(ep.episode_id)}
                      aria-label={isSeen ? "Desmarcar com a vist" : "Marcar com a vist"}
                      title={isSeen ? "Desmarcar com a vist" : "Marcar com a vist"}
                    >
                      <CheckIcon />
                    </button>
                    {/* <button
                      type="button"
                      className={"wanted-action fav" + (isFav ? " active" : "")}
                      onClick={() => toggleFav(ep.episode_id)}
                      aria-label={isFav ? "Treure de favorits" : "Afegir a favorits"}
                      title={isFav ? "Treure de favorits" : "Afegir a favorits"}
                    >
                      <StarIcon filled={isFav} />
                    </button> */}
                  </div>
                </article>
              );
            })}
            {!filteredEpisodes.length && episodes.length > 0 && (
              <p className="episodes-empty">No hi ha episodis que coincideixin amb la cerca.</p>
            )}
          </div>
        </section>
      </main>

      {showSeasonModal && (
        <div className="season-modal-overlay" onClick={() => setShowSeasonModal(false)}>
          <div className="season-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="season-modal-title">Selecciona una saga</h3>

            <div className="season-grid">
              {seasons.map((s) => (
                <button
                  key={s.season_number}
                  type="button"
                  className={
                    "season-card" + (activeSeason === s.season_number ? " active" : "")
                  }
                  onClick={() => {
                    selectSeason(s.season_number);
                    setShowSeasonModal(false);
                  }}
                >
                  <div className="season-card-image">
                    {getSeasonImage(s.season_number) && (
                      <img src={getSeasonImage(s.season_number)} alt={s.season_name} loading="lazy" />
                    )}
                  </div>
                  <span className="season-card-number">
                    Saga {String(s.season_number).padStart(2, "0")}
                  </span>
                  <span className="season-card-title">{s.season_name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMarkModal && (
        <div className="mark-modal-overlay" onClick={() => setShowMarkModal(false)}>
          <div className="mark-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="mark-modal-title">On has arribat?</h3>
            <p className="mark-modal-hint">
              Tots els episodis fins aquest, inclòs, es marcaran com a vistos. La resta es
              marcaran com a no vistos.
            </p>

            <select
              className="season-select mark-modal-select"
              value={
                episodes.find((e) => e.episode_id === markEpisodeId)?.season_number ?? ""
              }
              onChange={(e) => {
                const season = Number(e.target.value);
                const first = episodes.find((ep) => ep.season_number === season);
                setMarkEpisodeId(first?.episode_id ?? null);
              }}
            >
              {seasons.map((s) => (
                <option key={s.season_number} value={s.season_number}>
                  Saga {String(s.season_number).padStart(2, "0")} · {s.season_name}
                </option>
              ))}
            </select>

            <select
              className="season-select mark-modal-select"
              value={markEpisodeId ?? ""}
              onChange={(e) => setMarkEpisodeId(Number(e.target.value))}
            >
              {seasons
                .find(
                  (s) =>
                    s.season_number ===
                    (episodes.find((e) => e.episode_id === markEpisodeId)?.season_number ?? -1)
                )
                ?.episodes.map((ep) => (
                  <option key={ep.episode_id} value={ep.episode_id}>
                    Episodi {ep.episode_in_season} · #{ep.episode_absolute}
                  </option>
                ))}
            </select>

            <div className="mark-modal-actions">
              <button
                type="button"
                className="mark-modal-cancel"
                onClick={() => setShowMarkModal(false)}
              >
                Cancel·la
              </button>
              <button
                type="button"
                className="mark-modal-confirm"
                onClick={confirmMarkProgress}
                disabled={!markEpisodeId}
              >
                Confirma
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
