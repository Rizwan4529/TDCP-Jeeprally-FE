import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPartners,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";

const STATIC_FALLBACK_LOGOS = [
  "/assets/images/p1.png",
  "/assets/images/p2.jpg",
  "/assets/images/p3.png",
];

const MARQUEE_COPIES = 6;

const LogoCard = ({ src }) => (
  <div className="bg-white rounded-md p-1 h-20 w-50 md:h-30 md:w-60 flex items-center justify-center mx-3 md:mx-4 shadow-sm border border-gray-50 flex-shrink-0">
    <img
      src={src}
      className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-110"
      alt="Partner"
    />
  </div>
);

const Partners = () => {
  const { data: partnersRaw = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: fetchPartners,
    refetchOnWindowFocus: false,
  });

  const partnerSlots = useMemo(() => {
    const sorted = [...partnersRaw]
      .filter((p) => p.is_active !== false)
      .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

    const fromApi = sorted
      .map((p) => {
        const src = resolveCheckpointImageUrl(p.logo_url);
        if (!src) return null;
        return { key: p._id, src };
      })
      .filter(Boolean);

    if (fromApi.length > 0) return fromApi;

    return STATIC_FALLBACK_LOGOS.map((src, i) => ({
      key: `fallback-${i}`,
      src,
    }));
  }, [partnersRaw]);

  const marqueeLogos = useMemo(() => {
    const out = [];
    for (let c = 0; c < MARQUEE_COPIES; c += 1) {
      partnerSlots.forEach((slot, i) => {
        out.push({ ...slot, uid: `${slot.key}-${c}-${i}` });
      });
    }
    return out;
  }, [partnerSlots]);

  return (
    <section className="py-10 bg-section overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-[29px] md:text-[42px] font-gilda text-black text-center">Our Partners</h2>
      </div>

      <div className="relative flex overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {marqueeLogos.map((item) => (
            <LogoCard key={`logo-1-${item.uid}`} src={item.src} />
          ))}
        </div>

        <div className="animate-marquee flex whitespace-nowrap">
          {marqueeLogos.map((item) => (
            <LogoCard key={`logo-2-${item.uid}`} src={item.src} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
