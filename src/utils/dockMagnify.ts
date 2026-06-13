/**
 * Courbe de grossissement du dock — adaptée de PuruVJ/macos-web (MIT).
 * @see https://github.com/PuruVJ/macos-web
 */

export const DOCK_BASE_WIDTH = 57.6;

const DISTANCE_LIMIT = DOCK_BASE_WIDTH * 6;

export const DOCK_BEYOND_DISTANCE = DISTANCE_LIMIT + 1;

const DISTANCE_INPUT = [
  -DISTANCE_LIMIT,
  -DISTANCE_LIMIT / 1.25,
  -DISTANCE_LIMIT / 2,
  0,
  DISTANCE_LIMIT / 2,
  DISTANCE_LIMIT / 1.25,
  DISTANCE_LIMIT,
];

const WIDTH_OUTPUT = [
  DOCK_BASE_WIDTH,
  DOCK_BASE_WIDTH * 1.1,
  DOCK_BASE_WIDTH * 1.414,
  DOCK_BASE_WIDTH * 2,
  DOCK_BASE_WIDTH * 1.414,
  DOCK_BASE_WIDTH * 1.1,
  DOCK_BASE_WIDTH,
];

/**
 * Calcule la largeur d'une icône du dock selon la distance horizontale du curseur.
 */
export function dockWidthFromDistance(distanceDelta: number): number {
  const xs = DISTANCE_INPUT;
  const ys = WIDTH_OUTPUT;

  if (distanceDelta <= xs[0]) return ys[0];
  if (distanceDelta >= xs[xs.length - 1]) return ys[ys.length - 1];

  for (let i = 0; i < xs.length - 1; i++) {
    if (distanceDelta >= xs[i] && distanceDelta <= xs[i + 1]) {
      const t = (distanceDelta - xs[i]) / (xs[i + 1] - xs[i]);
      return ys[i] + t * (ys[i + 1] - ys[i]);
    }
  }

  return DOCK_BASE_WIDTH;
}
