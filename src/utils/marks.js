const STORAGE_KEY = "opc_marks";

const DEFAULT_INTRO_END = 170; // 2:50
const DEFAULT_NEXT_TRIGGER_OFFSET = 60; // seconds before end

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(all) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getMarks(episodeId) {
  return readAll()[episodeId] || {};
}

export function setIntroEnd(episodeId, seconds) {
  const all = readAll();
  all[episodeId] = { ...all[episodeId], introEnd: seconds };
  writeAll(all);
}

export function setNextTrigger(episodeId, seconds) {
  const all = readAll();
  all[episodeId] = { ...all[episodeId], nextTrigger: seconds };
  writeAll(all);
}

export function resolveMarks(episodeId, duration) {
  const marks = getMarks(episodeId);
  const introEnd = typeof marks.introEnd === "number" ? marks.introEnd : DEFAULT_INTRO_END;
  const nextTrigger =
    typeof marks.nextTrigger === "number"
      ? marks.nextTrigger
      : Math.max(0, (duration || 0) - DEFAULT_NEXT_TRIGGER_OFFSET);
  return { introEnd, nextTrigger };
}
