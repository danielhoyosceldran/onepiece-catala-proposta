function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function bountyForEpisode(ep) {
  const seed = hashSeed(ep.episode_id || String(ep.episode_absolute));
  const base = 8_000_000 + (ep.episode_absolute || 0) * 4_100_000;
  const variance = seed % 17_000_000;
  return base + variance;
}

export function formatBounty(amount) {
  return amount.toLocaleString("ca-ES");
}

export function synopsisForEpisode(ep) {
  return `Episodi ${ep.episode_in_season} de la saga ${ep.season_name}. La tripulació del barret de palla continua la seva aventura enmig del perill.`;
}

export function flattenOrdered(episodes) {
  return [...episodes].sort((a, b) => a.episode_absolute - b.episode_absolute);
}

export function getAdjacentEpisode(episodes, currentEpisodeId, direction = 1) {
  const ordered = flattenOrdered(episodes);
  const idx = ordered.findIndex((e) => e.episode_id === currentEpisodeId);
  if (idx === -1) return null;
  return ordered[idx + direction] || null;
}

export function groupBySeason(episodes) {
  const map = new Map();
  for (const ep of episodes) {
    if (!map.has(ep.season_number)) {
      map.set(ep.season_number, {
        season_number: ep.season_number,
        season_name: ep.season_name,
        episodes: [],
      });
    }
    map.get(ep.season_number).episodes.push(ep);
  }
  return [...map.values()].sort((a, b) => a.season_number - b.season_number);
}
