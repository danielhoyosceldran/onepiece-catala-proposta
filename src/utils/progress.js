const STORAGE_KEY = "opc_progress";

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

export function getProgress(episodeId) {
  return readAll()[episodeId] || null;
}

export function getAllProgress() {
  return readAll();
}

export function setProgress(episodeId, { time, duration }) {
  const all = readAll();
  const prev = all[episodeId] || {};
  const completed = duration > 0 && duration - time <= 5;
  all[episodeId] = {
    ...prev,
    time,
    duration,
    completed: prev.completed || completed,
    updatedAt: Date.now(),
  };
  writeAll(all);
  return all[episodeId];
}

export function markCompleted(episodeId) {
  const all = readAll();
  const prev = all[episodeId] || {};
  all[episodeId] = { ...prev, completed: true, updatedAt: Date.now() };
  writeAll(all);
}
