import { useEffect, useState } from "react";

const NEVER_KEY = "opc_install_never";
const LATER_KEY = "opc_install_later";
const SHOW_DELAY_MS = 4000;

function readFlag(storage, key) {
  try {
    return storage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(storage, key) {
  try {
    storage.setItem(key, "1");
  } catch {
    /* emmagatzematge no disponible: només s'amaga en aquesta sessió */
  }
}

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// iOS Safari no emet `beforeinstallprompt`: cal explicar el pas manual.
function isIosSafari() {
  const ua = window.navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return isIos && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [never, setNever] = useState(false);

  useEffect(() => {
    const suppressed = () =>
      isStandalone() ||
      readFlag(localStorage, NEVER_KEY) ||
      readFlag(sessionStorage, LATER_KEY);
    if (suppressed()) return;

    let timer;
    const show = () => {
      if (suppressed()) return;
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferred(e);
      show();
    };
    const onInstalled = () => {
      writeFlag(localStorage, NEVER_KEY);
      setVisible(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    if (isIosSafari()) {
      setIos(true);
      show();
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible) return null;

  const close = (persistNever) => {
    if (persistNever) writeFlag(localStorage, NEVER_KEY);
    else writeFlag(sessionStorage, LATER_KEY);
    setVisible(false);
  };

  const install = async () => {
    // Instal·lar implica no tornar-ho a mostrar mai més.
    setNever(true);
    writeFlag(localStorage, NEVER_KEY);
    if (!deferred) {
      setVisible(false);
      return;
    }
    deferred.prompt();
    try {
      await deferred.userChoice;
    } finally {
      setDeferred(null);
      setVisible(false);
    }
  };

  return (
    <aside className="install-prompt" role="dialog" aria-labelledby="install-prompt-title">
      <img src="/icon-192.png" alt="" className="install-prompt-icon" />
      <div className="install-prompt-body">
        <h2 id="install-prompt-title" className="install-prompt-title">
          Instal·la One Piece Cat
        </h2>
        {ios ? (
          <p className="install-prompt-text">
            Toca <strong>Compartir</strong> i després{" "}
            <strong>Afegeix a la pantalla d'inici</strong> per tenir-la sempre a mà.
          </p>
        ) : (
          <p className="install-prompt-text">
            Afegeix l'app al teu dispositiu i obre els capítols directament, a pantalla completa.
          </p>
        )}

        <label className="install-prompt-never">
          <input
            type="checkbox"
            checked={never}
            onChange={(e) => setNever(e.target.checked)}
          />
          <span>No ho tornis a mostrar</span>
        </label>

        <div className="install-prompt-actions">
          {!ios && (
            <button type="button" className="install-prompt-install" onClick={install}>
              Instal·la
            </button>
          )}
          <button type="button" className="install-prompt-later" onClick={() => close(never)}>
            {ios ? "Entesos" : "Ara no"}
          </button>
        </div>
      </div>
    </aside>
  );
}
