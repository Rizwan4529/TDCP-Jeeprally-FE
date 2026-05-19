import React, { useState } from "react";
import { FiImage } from "react-icons/fi";
import {
  handleImageError,
  resolveImageUrl,
} from "../../../utils/constants.js";
import CheckpointDescriptionPreview from "./CheckpointDescriptionPreview.jsx";

function CheckpointImageSlot({ image, title, onOpen }) {
  const [broken, setBroken] = useState(false);
  const url = resolveImageUrl(image, null);
  const isClickable = Boolean(url && !broken && onOpen);

  if (!url || broken) {
    return (
      <div
        className="rm-card-img rm-card-img-placeholder"
        role="img"
        aria-label={`No image for ${title}`}
      >
        <FiImage aria-hidden className="rm-card-img-placeholder-icon" />
      </div>
    );
  }

  const imageElement = (
    <img
      className="rm-card-img"
      src={url}
      alt=""
      onError={(event) => {
        handleImageError(event, null);
        setBroken(true);
      }}
    />
  );

  if (!isClickable) {
    return imageElement;
  }

  return (
    <button
      type="button"
      className="rm-card-img-button"
      onClick={onOpen}
      aria-label={`View image for ${title}`}
    >
      {imageElement}
    </button>
  );
}

export default function CheckpointCard({ checkpoint, onImageClick, onReadMore }) {
  const km = `(${checkpoint.km_start}–${checkpoint.km_end} KM)`;

  return (
    <article className="rm-card">
      <CheckpointImageSlot
        image={checkpoint.image}
        title={checkpoint.title}
        onOpen={onImageClick ? () => onImageClick(checkpoint) : undefined}
      />
      <div className="rm-card-body">
        <h2 className="rm-card-title">
          {checkpoint.title} <span className="rm-km">{km}</span>
        </h2>
        <CheckpointDescriptionPreview
          checkpoint={checkpoint}
          onReadMore={onReadMore}
        />
      </div>
    </article>
  );
}
