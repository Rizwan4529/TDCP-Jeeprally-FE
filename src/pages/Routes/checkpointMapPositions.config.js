/**
 * Manual checkpoint positions on the track map image.
 *
 * FIELDS (all optional per slot)
 * - topPct:            0–100 — vertical position from top of map.
 * - side:              "left" | "right"
 * - leftPct:           LEFT column only — distance from canvas left to the row’s left edge.
 *                      Try 2–12.
 * - rightPct:          RIGHT column only — distance from canvas right to the row’s right edge
 *                      (card side). Pinning here lets connectorWidthPx grow left toward the map.
 *                      Try 4–10.
 * - connectorWidthPx:  Connector line length in px (default 60). Grows toward the map line.
 *                      (Alias: widthPx)
 */

/** 1–4 checkpoints (zigzag layout) */
export const ZIGZAG_CHECKPOINT_POSITIONS = [
  // { topPct: 12, side: "left", leftPct: 4, connectorWidthPx: 80 },
  // { topPct: 36, side: "right", rightPct: 6, connectorWidthPx: 70 },
];

/** 5–6 checkpoints on map (paired rows) */
export const PAIRED_CHECKPOINT_POSITIONS = [
  { topPct: 12, side: "left", leftPct: 4, connectorWidthPx: 110 },
  { topPct: 12, side: "right", rightPct: 1, connectorWidthPx: 70 },
  { topPct: 50, side: "left", leftPct: 7, connectorWidthPx: 95 },
  { topPct: 50, side: "right", rightPct: -5, connectorWidthPx: 86 },
  { topPct: 88, side: "left", leftPct: 1, connectorWidthPx: 85 },
  { topPct: 88, side: "right", rightPct: 6, connectorWidthPx: 100 },
];
