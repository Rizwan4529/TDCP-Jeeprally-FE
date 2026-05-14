import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRallyDocuments,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";

function chunkPairs(docs) {
  const pages = [];
  for (let i = 0; i < docs.length; i += 2) {
    pages.push(docs.slice(i, i + 2));
  }
  return pages;
}

async function downloadRallyFile(url, title) {
  const base =
    (title || "document")
      .replace(/[/\\?%*:|"<>]/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 120) || "document";
  const extMatch = url.split(/[#?]/)[0].match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : "pdf";
  const filename = base.toLowerCase().endsWith(`.${ext}`)
    ? base
    : `${base}.${ext}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      return;
    }
  } catch {
    /* network / CORS — fall back below */
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function normalizeFileUrlString(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  return s || null;
}

const RulesCard = ({
  title,
  bgColor,
  buttonBg,
  titleColor = "#FFFFFF",
  isDark = false,
  fileUrl,
}) => {
  const rawPath = normalizeFileUrlString(fileUrl);
  const canDownload = Boolean(rawPath);

  return (
    <div
      className={`flex-1 min-h-[400px] md:min-h-[450px] rounded-md p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-10 transition-transform duration-500 hover:-translate-y-2`}
      style={{ backgroundColor: bgColor }}
    >
      <h3
        className="text-2xl md:text-3xl font-gilda leading-tight tracking-wide"
        style={{ color: titleColor }}
      >
        {title}
      </h3>

      <button
        type="button"
        disabled={!canDownload}
        onClick={() => {
          if (!rawPath) return;
          const url = resolveCheckpointImageUrl(rawPath);
          if (url) void downloadRallyFile(url, title);
        }}
        className={`px-10 py-3 rounded-full  transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed`}
        style={{ backgroundColor: buttonBg, color: isDark ? "white" : "black" }}
      >
        Download
      </button>
    </div>
  );
};

const STATIC_FALLBACK_PAGES = [
  [
    {
      _id: "static-a",
      title: "CDR 2026, RALLY COMPETITION RULES",
      file_url: null,
    },
    {
      _id: "static-b",
      title: "DIRT BIKE CDR 2026, RALLY COMPETITION RULES",
      file_url: null,
    },
  ],
];

const RallyRules = ({ content }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const eventId = activeEvent?._id;

  const { data: documentsRaw = [] } = useQuery({
    queryKey: ["rally", "documents", eventId],
    queryFn: () => fetchRallyDocuments(eventId),
    enabled: Boolean(eventId),
    refetchOnWindowFocus: false,
  });

  const documents = useMemo(() => {
    const list = (documentsRaw ?? [])
      .map((d) => ({
        ...d,
        file_url: d.file_url ?? d.fileUrl ?? d.document_url ?? null,
      }))
      .filter((d) => d.is_public !== false)
      .filter((d) => {
        const c = (d.category ?? "").toString().toLowerCase();
        return !c || c === "rules";
      })
      .sort(
        (a, b) =>
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime(),
      );
    return list.length > 0 ? list : null;
  }, [documentsRaw]);

  const pages = useMemo(() => {
    if (!documents || documents.length === 0) return STATIC_FALLBACK_PAGES;
    return chunkPairs(documents);
  }, [documents]);

  const pageCount = Math.max(1, pages.length);
  const showNav = documents && documents.length > 2;

  useEffect(() => {
    setPageIndex((i) => Math.min(i, pageCount - 1));
  }, [pageCount]);

  const handleNext = () => {
    setPageIndex((i) => Math.min(i + 1, pageCount - 1));
  };

  const handlePrev = () => {
    setPageIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <section className="py-24 bg-section">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
          <div className="w-full lg:w-[35%] space-y-8">
            <h2 className="text-[29px] md:text-[42px] font-gilda leading-tight text-black">
              {content?.title || (
                <>
                  Rally Rules and <br className="hidden md:block" /> Documents
                </>
              )}
            </h2>
            <p className="para text-gray-500 leading-relaxed max-w-3xl">
              {content?.subTitle ||
                "Welcome to the Cholistan Desert Rally 2026 Rules and Documents area. All Rally Racers, looking to read the rules for competition or application for registration and Rally safety guidelines, then this is the place to get them."}
            </p>
          </div>

          <div className="w-full lg:w-[65%] relative">
            {showNav && (
              <div className="absolute top-0 right-0 z-10 flex gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={pageIndex <= 0}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous documents"
                >
                  <span className="text-lg rotate-180">→</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={pageIndex >= pageCount - 1}
                  className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center hover:bg-brand-green-hover transition-all duration-300 shadow-md shadow-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next documents"
                >
                  <span className="text-lg">→</span>
                </button>
              </div>
            )}

            <div className="overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  width: `${pageCount * 100}%`,
                  transform: `translateX(-${(pageIndex * 100) / pageCount}%)`,
                }}
              >
                {pages.map((pair, pIdx) => (
                  <div
                    key={pair[0]?._id ?? pIdx}
                    className="flex flex-col md:flex-row gap-6 md:gap-8 shrink-0"
                    style={{ width: `${100 / pageCount}%` }}
                  >
                    <RulesCard
                      title={pair[0]?.title ?? ""}
                      bgColor="#F9DA4A"
                      titleColor="#111111"
                      buttonBg="#B44423"
                      isDark={true}
                      fileUrl={pair[0]?.file_url}
                    />
                    {pair[1] ? (
                      <RulesCard
                        title={pair[1].title}
                        bgColor="#B44423"
                        buttonBg="#F9DA4A"
                        isDark={false}
                        fileUrl={pair[1].file_url}
                      />
                    ) : (
                      <div
                        className="flex-1 min-h-[400px] md:min-h-[450px] rounded-md opacity-0 pointer-events-none hidden md:block"
                        aria-hidden
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RallyRules;
