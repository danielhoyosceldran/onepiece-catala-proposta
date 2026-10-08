import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const ICON = { viewBox: "0 0 24 24", className: "hero-flag-icon", "aria-hidden": "true" };

const LAYERS = [
  { ref: "sky", scroll: 0.04, mouse: 18 },
  { ref: "clouds", scroll: 0.12, mouse: 14 },
  { ref: "ship", scroll: 0.22, mouse: 24 },
  { ref: "birds", scroll: 0.12, mouse: 14 },
];

export default function ParallaxHero() {
  const skyRef = useRef(null);
  const cloudsRef = useRef(null);
  const shipRef = useRef(null);
  const birdsRef = useRef(null);
  const [showCredits, setShowCredits] = useState(false);
  const creditsBtnRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!showCredits) return;
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setShowCredits(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      creditsBtnRef.current?.focus();
    };
  }, [showCredits]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const refs = { sky: skyRef, clouds: cloudsRef, ship: shipRef, birds: birdsRef };
    let scrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

    const apply = () => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const nx = mouseX / (vw / 2);
      const ny = mouseY / (vh / 2);
      LAYERS.forEach(({ ref, scroll, mouse }) => {
        const el = refs[ref].current;
        if (!el) return;
        const dx = -nx * mouse;
        const dy = -ny * mouse + scrollY * scroll;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      ticking = false;
    };

    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      schedule();
    };
    const onMouseMove = (e) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      mouseX = e.clientX - vw / 2;
      mouseY = e.clientY - vh / 2;
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-layer hero-sky" ref={skyRef}>
        <img src="/parallax/sky.svg" alt="" fetchpriority="high" decoding="async" />
      </div>
      <div className="hero-layer hero-clouds" ref={cloudsRef}>
        <img src="/parallax/clouds.svg" alt="" decoding="async" />
      </div>
      <div className="hero-layer hero-ship" ref={shipRef}>
        <img src="/parallax/going_marry.svg" alt="El Going Merry navegant per alta mar" fetchpriority="high" decoding="async" />
      </div>
      <div className="hero-layer hero-birds" ref={birdsRef}>
        <div className="hero-birds-drift">
          <img src="/parallax/birds.svg" alt="" decoding="async" />
        </div>
      </div>
      <div className="hero-fade" />

      <h1 className="sr-only">One Piece en català</h1>

      <nav className="hero-flags" aria-label="Enllaços principals">
        <Link to="/capitols" className="hero-flag hero-flag-primary">
          Veure One Piece en català
          <svg {...ICON}>
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
        </Link>
        <a
          href="https://t.me/onepiececatala"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-flag"
        >
          Grup de Telegram
          <svg {...ICON}>
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
        <a
          href="https://xarxacatala.cat"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-flag"
        >
          Xarxa Catalana
          <svg {...ICON}>
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
        <button
          type="button"
          className="hero-credits-link"
          ref={creditsBtnRef}
          onClick={() => setShowCredits(true)}
        >
          Crèdits
        </button>
      </nav>

      {showCredits && (
        <div className="credits-modal-overlay" onClick={() => setShowCredits(false)}>
          <div
            className="credits-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credits-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="credits-modal-close"
              aria-label="Tancar"
              ref={closeBtnRef}
              onClick={() => setShowCredits(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <h2 id="credits-title" className="credits-modal-title">Crèdits</h2>
            <p>One Piece Cat — un arxiu de fans, sense finalitats comercials.</p>
            <p>
              Vídeos servits per{" "}
              <a href="https://onepiece.xarxacatala.cat/" target="_blank" rel="noreferrer noopener">
                onepiece.xarxacatala.cat
              </a>
              . Aquest portal no allotja cap contingut propi.
            </p>
            <p>Fet per Daniel Hoyos Celdrán.</p>
          </div>
        </div>
      )}
    </section>
  );
}
