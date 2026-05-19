import { resolveImageUrl } from "../../utils/constants.js";
import {
  PAIRED_CHECKPOINT_POSITIONS,
  ZIGZAG_CHECKPOINT_POSITIONS,
} from "./checkpointMapPositions.config.js";

export const CHECKPOINT_DESCRIPTION_PREVIEW_LIMIT = 2;

export function getCheckpointDescriptionPoints(checkpoint) {
  if (!Array.isArray(checkpoint?.description_points)) return [];
  return checkpoint.description_points.filter(
    (line) => typeof line === "string" && line.trim().length > 0,
  );
}

export function buildCheckpointLightboxItems(checkpoints = []) {
  return checkpoints
    .map((checkpoint) => {
      const src = resolveImageUrl(checkpoint?.image, null);
      if (!src) return null;

      return {
        checkpointId: checkpoint._id,
        src,
        alt: checkpoint.title ?? "Checkpoint image",
      };
    })
    .filter(Boolean);
}

export function findCheckpointLightboxIndex(items = [], checkpointId) {
  if (!checkpointId) return -1;
  return items.findIndex((item) => item.checkpointId === checkpointId);
}

export function shouldShowRoutesEmpty({
  eventId,
  activeCategory,
  routes = [],
  routesSuccess = false,
} = {}) {
  return (
    Boolean(eventId) &&
    Boolean(activeCategory) &&
    routesSuccess &&
    Array.isArray(routes) &&
    routes.length === 0
  );
}

export function shouldShowStageNotFound({
  stageId,
  stages = [],
  stagesSuccess = false,
} = {}) {
  return (
    Boolean(stageId) &&
    stagesSuccess &&
    Array.isArray(stages) &&
    !stages.some((stage) => stage._id === stageId)
  );
}

export const CHECKPOINT_LAYOUT_DEFAULTS = Object.freeze({
  zigzagThreshold: 4,
  maxPairRowsInMap: 3,
  padTopPct: 12,
  padBottomPct: 12,
});

export const MAX_CHECKPOINTS_IN_MAP =
  CHECKPOINT_LAYOUT_DEFAULTS.maxPairRowsInMap * 2;

function buildEvenTopPercents(count, padTopPct, padBottomPct) {
  if (count <= 0) return [];
  if (count === 1) return [50];
  const span = 100 - padTopPct - padBottomPct;
  return Array.from(
    { length: count },
    (_, index) => padTopPct + (index / (count - 1)) * span,
  );
}

function sideForZigzag(checkpoint, index) {
  const orderNum = Number(checkpoint?.order ?? index + 1);
  return orderNum % 2 === 1 ? "left" : "right";
}

function resolveMapLeftPct(custom) {
  if (custom?.leftPct != null) return custom.leftPct;
  if (custom?.horizontalPct != null) return custom.horizontalPct;
  return null;
}

/**
 * @param {object} slot
 * @param {number} index
 * @param {'zigzag'|'paired'} mode
 */
export function applyCheckpointMapPosition(slot, index, mode) {
  const table =
    mode === "zigzag" ? ZIGZAG_CHECKPOINT_POSITIONS : PAIRED_CHECKPOINT_POSITIONS;
  const custom = table?.[index];
  if (!custom) return slot;

  const side = custom.side ?? slot.side;
  const leftPct = side === "right" ? null : resolveMapLeftPct(custom);

  return {
    ...slot,
    ...(custom.topPct != null ? { topPct: custom.topPct } : {}),
    ...(custom.side ? { side: custom.side } : {}),
    ...(leftPct != null ? { leftPct } : {}),
    ...(custom.rightPct != null ? { rightPct: custom.rightPct } : {}),
    ...(custom.connectorWidthPx != null
      ? { connectorWidthPx: custom.connectorWidthPx }
      : custom.widthPx != null
        ? { connectorWidthPx: custom.widthPx }
        : {}),
  };
}

export const DEFAULT_CONNECTOR_WIDTH_PX = 60;

/**
 * Anchor map checkpoint row.
 * Left column: leftPct (row grows right; connector widens toward map on the right).
 * Right column: rightPct (row pinned on the right; connector widens left toward map).
 */
export function buildMapCheckpointStyle({ topPct, leftPct, rightPct, side }) {
  const style = { top: `${topPct}%`, transform: "translateY(-50%)" };

  if (side === "right" && rightPct != null) {
    return {
      ...style,
      right: `${rightPct}%`,
      left: "auto",
    };
  }

  if (leftPct != null) {
    return {
      ...style,
      left: `${leftPct}%`,
      right: "auto",
    };
  }

  return { top: `${topPct}%` };
}

export function buildConnectorStyle(connectorWidthPx) {
  if (connectorWidthPx == null) return undefined;
  return {
    width: `${connectorWidthPx}px`,
    flexShrink: 0,
  };
}

export function computeCheckpointLayout(checkpoints = [], options = {}) {
  const {
    zigzagThreshold = CHECKPOINT_LAYOUT_DEFAULTS.zigzagThreshold,
    maxPairRowsInMap = CHECKPOINT_LAYOUT_DEFAULTS.maxPairRowsInMap,
    padTopPct = CHECKPOINT_LAYOUT_DEFAULTS.padTopPct,
    padBottomPct = CHECKPOINT_LAYOUT_DEFAULTS.padBottomPct,
  } = options;

  if (!Array.isArray(checkpoints) || checkpoints.length === 0) {
    return { inMap: [], overflow: [], mode: "empty" };
  }

  const count = checkpoints.length;

  if (count <= zigzagThreshold) {
    const topPercents = buildEvenTopPercents(count, padTopPct, padBottomPct);
    const inMap = checkpoints.map((checkpoint, index) =>
      applyCheckpointMapPosition(
        {
          checkpoint,
          side: count === 1 ? "right" : sideForZigzag(checkpoint, index),
          topPct: topPercents[index],
        },
        index,
        "zigzag",
      ),
    );
    return { inMap, overflow: [], mode: "zigzag" };
  }

  const maxInMap = maxPairRowsInMap * 2;
  const visible = checkpoints.slice(0, maxInMap);
  const overflow = checkpoints.slice(maxInMap);

  const rows = Math.ceil(visible.length / 2);
  const rowTopPercents = buildEvenTopPercents(rows, padTopPct, padBottomPct);

  const inMap = visible.map((checkpoint, index) => {
    const rowIndex = Math.floor(index / 2);
    const side = index % 2 === 0 ? "left" : "right";
    return applyCheckpointMapPosition(
      {
        checkpoint,
        side,
        topPct: rowTopPercents[rowIndex],
      },
      index,
      "paired",
    );
  });

  return { inMap, overflow, mode: "paired" };
}
