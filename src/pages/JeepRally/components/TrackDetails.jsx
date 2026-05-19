import React, { useMemo } from "react";
import ImageLightbox from "../../../components/common/ImageLightbox.jsx";
import { useImageLightbox } from "../../../hooks/useImageLightbox.js";
import { resolveImageUrl } from "../../../utils/constants.js";

const DEFAULT_TRACK_MAP_SRC = "/assets/images/map_7.png";

const TrackDetails = ({ content }) => {
  const imageLightbox = useImageLightbox();

  const trackImage = useMemo(
    () => ({
      src: resolveImageUrl(content?.mapImg, DEFAULT_TRACK_MAP_SRC),
      alt: "Rally Route Map",
    }),
    [content?.mapImg],
  );

  const openTrackMap = () => {
    imageLightbox.open([trackImage], 0);
  };

  return (
    <section className="relative overflow-hidden bg-section py-section-break">
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 -translate-y-12 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(#000 2px, transparent 2px)`,
            backgroundSize: "20px 20px",
            maskImage: "linear-gradient(to top left, black, transparent)",
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <h2 className="font-gilda text-[29px] leading-tight text-black md:text-[42px]">
            {content?.title || "Rally Track Details"}
          </h2>
          <p className="para text-gray-500">
            {content?.subtitle ||
              "Get a closer look at the terrain, distance, and key checkpoints of the race."}
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="rounded-md bg-[#E7D6A7] p-4 shadow-2xl shadow-black/10 md:p-8">
            <button
              type="button"
              onClick={openTrackMap}
              className="block w-full cursor-zoom-in overflow-hidden rounded-sm border border-black/5 text-left"
              aria-label="View rally route map"
            >
              <img
                src={trackImage.src}
                alt={trackImage.alt}
                className="h-auto w-full transition-transform duration-300 hover:scale-[1.01]"
              />
            </button>
          </div>
        </div>
      </div>

      <ImageLightbox
        isOpen={imageLightbox.isOpen}
        onClose={imageLightbox.close}
        items={imageLightbox.items}
        index={imageLightbox.index}
        onPrev={imageLightbox.goPrev}
        onNext={imageLightbox.goNext}
        label="Rally track map"
      />
    </section>
  );
};

export default TrackDetails;
