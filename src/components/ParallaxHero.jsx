import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
        <img src="/parallax/sky.svg" alt="" />
      </div>
      <div className="hero-layer hero-clouds" ref={cloudsRef}>
        <img src="/parallax/clouds.svg" alt="" />
      </div>
      <div className="hero-layer hero-ship" ref={shipRef}>
        <img src="/parallax/going_marry.svg" alt="El Going Merry navegant per alta mar" />
      </div>
      <div className="hero-layer hero-birds" ref={birdsRef}>
        <div className="hero-birds-drift">
          <img src="/parallax/birds.svg" alt="" />
        </div>
      </div>
      <div className="hero-fade" />

      <nav className="hero-flags">
        <Link to="/capitols" className="hero-flag">
          Veure One Piece en català
        </Link>
        <a
          href="https://t.me/onepiececatala"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-flag"
        >
          Grup de Telegram
        </a>
        <a
          href="https://xarxacatala.cat"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-flag"
        >
          Xarxa Catalana
        </a>
        <button type="button" className="hero-credits-link" onClick={() => setShowCredits(true)}>
          Crèdits
        </button>
      </nav>

      {showCredits && (
        <div className="credits-modal-overlay" onClick={() => setShowCredits(false)}>
          <div className="credits-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="credits-modal-close"
              aria-label="Tancar"
              onClick={() => setShowCredits(false)}
            >
              ×
            </button>
            <h3 className="credits-modal-title">Crèdits</h3>
            <p>One Piece Cat — un arxiu de fans, sense finalitats comercials.</p>
            <p>
              Vídeos servits per{" "}
              <a href="https://onepiece.xarxacatala.cat/" target="_blank" rel="noreferrer noopener">
                onepiece.xarxacatala.cat
              </a>
              . Aquest portal no allotja cap contingut propi.
            </p>
            <p>Fet per Daniel Hoyos Celdrán amb Claude.</p>
          </div>
        </div>
      )}
    </section>
  );
}
