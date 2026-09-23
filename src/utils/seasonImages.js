const TOTAL_SEASONS = 30;

export function getSeasonImage(seasonNumber) {
  if (seasonNumber < 1 || seasonNumber > TOTAL_SEASONS) return null;
  return `/season_covers/${String(seasonNumber).padStart(2, "0")}.webp`;
}
