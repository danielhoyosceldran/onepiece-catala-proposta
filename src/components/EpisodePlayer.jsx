import { forwardRef } from "react";
import {
  BufferingIndicator,
  Container,
  Controls,
  createPlayer,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  orientationLockFeature,
  PiPButton,
  PlayButton,
  SeekButton,
  selectControls,
  Time,
  TimeSlider,
  VolumeSlider,
} from "@videojs/react";
import { I18nProvider } from "@videojs/react/i18n";
import "@videojs/react/i18n/locales/ca/register";
import { Video, videoFeatures } from "@videojs/react/video";
import "../styles/player.css";

// Reproductor Video.js amb les funcionalitats del preset de vídeo més el
// bloqueig d'orientació: en entrar a pantalla completa fa
// `await screen.orientation.lock("landscape")` i en sortir la desbloqueja.
const { Player, usePlayer } = createPlayer({
  features: [...videoFeatures, orientationLockFeature],
});

const ICON_PROPS = { viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true" };
const S = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

function PlayIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M7 5.2v9.6c0 .6.66 1 1.2.68l7.6-4.8a.8.8 0 0 0 0-1.36l-7.6-4.8A.8.8 0 0 0 7 5.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function PauseIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <rect x="5.5" y="4.5" width="3" height="11" rx="1" fill="currentColor" />
      <rect x="11.5" y="4.5" width="3" height="11" rx="1" fill="currentColor" />
    </svg>
  );
}
function ReplayIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M4.5 10a5.5 5.5 0 1 0 1.7-3.98" {...S} />
      <path d="M4.5 3.8v3.4h3.4" {...S} />
    </svg>
  );
}
function SeekIcon({ dir, ...props }) {
  const back = dir === "backward";
  return (
    <svg {...ICON_PROPS} {...props}>
      <g transform={back ? undefined : "matrix(-1 0 0 1 20 0)"}>
        <path d="M4.5 10a5.5 5.5 0 1 0 1.7-3.98" {...S} />
        <path d="M4.5 3.8v3.4h3.4" {...S} />
      </g>
      <text x="10" y="12.6" textAnchor="middle" fontSize="6.2" fontWeight="600" fill="currentColor" fontFamily="inherit">
        10
      </text>
    </svg>
  );
}
function VolumeIcon({ level, ...props }) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M3.5 8v4h3l4 3.5v-11l-4 3.5h-3Z" fill="currentColor" stroke="none" />
      {level === "off" ? (
        <path d="m13.5 8 4 4m0-4-4 4" {...S} />
      ) : (
        <>
          <path d="M13.3 7.8a3 3 0 0 1 0 4.4" {...S} />
          {level !== "low" && <path d="M15.4 5.6a6 6 0 0 1 0 8.8" {...S} />}
        </>
      )}
    </svg>
  );
}
function PipIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <rect x="2.8" y="4.3" width="14.4" height="11.4" rx="2" {...S} />
      <rect x="10" y="10" width="5" height="3.6" rx="0.8" fill="currentColor" />
    </svg>
  );
}
function FullscreenIcon({ active, ...props }) {
  return (
    <svg {...ICON_PROPS} {...props}>
      {active ? (
        <path d="M7.5 3.5v4h-4M12.5 3.5v4h4M7.5 16.5v-4h-4M12.5 16.5v-4h4" {...S} />
      ) : (
        <path d="M3.5 7.5v-4h4M16.5 7.5v-4h-4M3.5 12.5v4h4M16.5 12.5v4h-4" {...S} />
      )}
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
function ChevronRightIcon(props) {
  return (
    <svg {...ICON_PROPS} {...props}>
      <path d="M8 4.5 13 10l-5 5.5" {...S} />
    </svg>
  );
}

// "Saltar intro" segueix la visibilitat de la HUD; "Següent" es manté visible
// durant els últims minuts de l'episodi.
function OverlayActions({ showSkipIntro, onSkipIntro, showNext, onNext }) {
  const controls = usePlayer(selectControls);
  const hudVisible = controls?.controlsVisible ?? true;

  if (!showSkipIntro && !showNext) return null;

  return (
    <div className={"ep-player-actions" + (hudVisible ? " hud-visible" : "")}>
      {showSkipIntro && (
        <button
          type="button"
          className={"ep-player-action" + (hudVisible ? " is-visible" : "")}
          onClick={onSkipIntro}
        >
          <SkipIcon /> Saltar intro
        </button>
      )}
      {showNext && (
        <button type="button" className="ep-player-action is-primary is-visible" onClick={onNext}>
          Següent episodi <ChevronRightIcon />
        </button>
      )}
    </div>
  );
}

const EpisodePlayer = forwardRef(function EpisodePlayer(
  { src, title, subtitle, showSkipIntro, onSkipIntro, showNext, onNext, ...videoProps },
  ref
) {
  return (
    <I18nProvider locale="ca">
      <Player>
        <Container className="ep-player">
          <Video ref={ref} className="ep-player-media" src={src} autoPlay playsInline {...videoProps} />

          <BufferingIndicator
            className="ep-player-buffering"
            render={(props) => (
              <div {...props}>
                <span className="ep-player-spinner" />
              </div>
            )}
          />

          <Controls.Root>
            <Controls.Backdrop className="ep-hud-backdrop" />
            <Controls.Content className="ep-hud">
              <div className="ep-hud-top">
                <div className="ep-hud-title">
                  <span className="ep-hud-title-main">{title}</span>
                  {subtitle && <span className="ep-hud-title-sub">{subtitle}</span>}
                </div>
              </div>

              <Controls.Group className="ep-hud-bottom" aria-label="Controls de reproducció">
                <div className="ep-hud-progress">
                  <Time.Value type="current" className="ep-hud-time" />
                  <TimeSlider.Root className="ep-slider ep-time-slider">
                    <TimeSlider.Track className="ep-slider-track">
                      <TimeSlider.Buffer className="ep-slider-buffer" />
                      <TimeSlider.Fill className="ep-slider-fill" />
                    </TimeSlider.Track>
                    <TimeSlider.Thumb className="ep-slider-thumb" />
                    <TimeSlider.Preview className="ep-slider-preview">
                      <TimeSlider.Value type="pointer" />
                    </TimeSlider.Preview>
                  </TimeSlider.Root>
                  <Time.Value type="remaining" toggle className="ep-hud-time ep-hud-time-remaining" />
                </div>

                <div className="ep-hud-row">
                  <div className="ep-hud-cluster">
                    <PlayButton
                      className="ep-hud-btn ep-hud-btn-play"
                      render={(props, state) => (
                        <button {...props}>
                          {state.ended ? <ReplayIcon /> : state.paused ? <PlayIcon /> : <PauseIcon />}
                        </button>
                      )}
                    />
                    <SeekButton
                      seconds={-10}
                      className="ep-hud-btn"
                      render={(props) => (
                        <button {...props}>
                          <SeekIcon dir="backward" />
                        </button>
                      )}
                    />
                    <SeekButton
                      seconds={10}
                      className="ep-hud-btn"
                      render={(props) => (
                        <button {...props}>
                          <SeekIcon dir="forward" />
                        </button>
                      )}
                    />
                    <div className="ep-hud-volume">
                      <MuteButton
                        className="ep-hud-btn"
                        render={(props, state) => (
                          <button {...props}>
                            <VolumeIcon level={state.muted ? "off" : state.volumeLevel} />
                          </button>
                        )}
                      />
                      <VolumeSlider.Root className="ep-slider ep-volume-slider">
                        <VolumeSlider.Track className="ep-slider-track">
                          <VolumeSlider.Fill className="ep-slider-fill" />
                        </VolumeSlider.Track>
                        <VolumeSlider.Thumb className="ep-slider-thumb" />
                      </VolumeSlider.Root>
                    </div>
                  </div>

                  <div className="ep-hud-cluster">
                    <PiPButton
                      className="ep-hud-btn"
                      render={(props) => (
                        <button {...props}>
                          <PipIcon />
                        </button>
                      )}
                    />
                    <FullscreenButton
                      className="ep-hud-btn"
                      render={(props, state) => (
                        <button {...props}>
                          <FullscreenIcon active={state.fullscreen} />
                        </button>
                      )}
                    />
                  </div>
                </div>
              </Controls.Group>
            </Controls.Content>
          </Controls.Root>

          <OverlayActions
            showSkipIntro={showSkipIntro}
            onSkipIntro={onSkipIntro}
            showNext={showNext}
            onNext={onNext}
          />

          <Gesture type="tap" pointer="mouse" action="togglePaused" />
          <Gesture type="doubletap" pointer="mouse" action="toggleFullscreen" />
          <Gesture type="doubletap" pointer="touch" region="left" action="seekStep" />
          <Gesture type="doubletap" pointer="touch" region="right" action="seekStep" />

          <Hotkey keys="Space" action="togglePaused" />
          <Hotkey keys="k" action="togglePaused" />
          <Hotkey keys="m" action="toggleMuted" />
          <Hotkey keys="f" action="toggleFullscreen" />
          <Hotkey keys="ArrowLeft" action="seekStep" />
          <Hotkey keys="ArrowRight" action="seekStep" />
          <Hotkey keys="j" action="seekStep" />
          <Hotkey keys="l" action="seekStep" />
          <Hotkey keys="ArrowUp" action="volumeStep" />
          <Hotkey keys="ArrowDown" action="volumeStep" />
          <Hotkey keys="0-9" action="seekToPercent" />
        </Container>
      </Player>
    </I18nProvider>
  );
});

export default EpisodePlayer;
