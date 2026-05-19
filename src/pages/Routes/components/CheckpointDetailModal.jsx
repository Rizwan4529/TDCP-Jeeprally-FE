import React, { useEffect } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { getCheckpointDescriptionPoints } from "../routes.utils.js";
import { handleImageError, resolveImageUrl } from "../../../utils/constants.js";

function CheckpointDetailModal({
  checkpoint,
  orderIndex,
  isOpen,
  onClose,
  onImageClick,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !checkpoint) return null;

  const points = getCheckpointDescriptionPoints(checkpoint);
  const km =
    checkpoint.km_start != null && checkpoint.km_end != null
      ? `${checkpoint.km_start}–${checkpoint.km_end} KM`
      : null;
  const imageUrl = resolveImageUrl(checkpoint.image, null);
  const orderNum = Number(checkpoint.order ?? orderIndex + 1);

  return (
    <div
      className="rm-checkpoint-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rm-checkpoint-modal-title"
    >
      <button
        type="button"
        className="rm-checkpoint-modal-backdrop"
        onClick={onClose}
        aria-label="Close checkpoint details"
      />

      <div className="rm-checkpoint-modal-panel">
        <button
          type="button"
          className="rm-checkpoint-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX aria-hidden />
        </button>

        {imageUrl ? (
          <button
            type="button"
            className="rm-checkpoint-modal-hero-button"
            onClick={() => onImageClick?.(checkpoint)}
            aria-label={`View full image for ${checkpoint.title}`}
          >
            <img
              src={imageUrl}
              alt=""
              className="rm-checkpoint-modal-hero"
              onError={(event) => handleImageError(event, null)}
            />
          </button>
        ) : (
          <div
            className="rm-checkpoint-modal-hero rm-checkpoint-modal-hero--placeholder"
            role="img"
            aria-label={`No image for ${checkpoint.title}`}
          >
            <FiImage aria-hidden className="rm-checkpoint-modal-hero-icon" />
          </div>
        )}

        <div className="rm-checkpoint-modal-body">
          <div className="rm-checkpoint-modal-head">
            <span className="rm-checkpoint-modal-step">{orderNum}</span>
            <div className="rm-checkpoint-modal-head-copy">
              <h2
                id="rm-checkpoint-modal-title"
                className="rm-checkpoint-modal-title"
              >
                {checkpoint.title}
              </h2>
              {km ? <p className="rm-checkpoint-modal-km">{km}</p> : null}
            </div>
          </div>

          {(checkpoint.is_start || checkpoint.is_finish) && (
            <div className="rm-checkpoint-modal-badges">
              {checkpoint.is_start && (
                <span className="rm-checkpoint-modal-badge">Start</span>
              )}
              {checkpoint.is_finish && (
                <span className="rm-checkpoint-modal-badge">Finish</span>
              )}
            </div>
          )}

          {points.length > 0 ? (
            <ul className="rm-checkpoint-modal-list">
              {points.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="rm-checkpoint-modal-empty">
              No additional details for this checkpoint.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckpointDetailModal;
