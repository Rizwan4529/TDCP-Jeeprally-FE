import React from "react";
import {
  CHECKPOINT_DESCRIPTION_PREVIEW_LIMIT,
  getCheckpointDescriptionPoints,
} from "../routes.utils.js";

export default function CheckpointDescriptionPreview({
  checkpoint,
  onReadMore,
  listClassName = "rm-list",
  buttonClassName = "rm-read-more",
}) {
  const points = getCheckpointDescriptionPoints(checkpoint);
  if (points.length === 0) return null;

  const hasMore = points.length > CHECKPOINT_DESCRIPTION_PREVIEW_LIMIT;
  const visiblePoints = hasMore
    ? points.slice(0, CHECKPOINT_DESCRIPTION_PREVIEW_LIMIT)
    : points;

  return (
    <div className="rm-description-preview">
      <ul className={listClassName}>
        {visiblePoints.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {hasMore && onReadMore ? (
        <button
          type="button"
          className={buttonClassName}
          onClick={() => onReadMore(checkpoint)}
        >
          Read more
        </button>
      ) : null}
    </div>
  );
}
