import { resolveImageUrl } from "../../utils/constants.js";

export const DEFAULT_HERO_TITLE =
  "Where Speed Meets\nThe Spirit Of The\nDesert";

export const DEFAULT_PROMO_TITLE = "Reliving the\nDesert Thrill";

export const STATIC_EVENT_SUBTITLE =
  "An electrifying championship event featuring elite drivers, precision cornering, and high-speed technical racing across challenging desert terrain.";

export const DEFAULT_CHAMPIONS_CONTENT = {
  title: "Champions of the Rally",
  subtitle: "Celebrating the top performers who conquered the desert track",
};

const LISTING_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const SUMMARY_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatRallyListingDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return LISTING_DATE_FORMAT.format(date).toUpperCase();
}

export function formatRallySummaryDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return SUMMARY_DATE_FORMAT.format(date).replace(/\//g, "-");
}

export function mapPastRallyToListingCard(rally) {
  return {
    id: rally._id,
    title: rally.name,
    date: formatRallyListingDate(rally.date),
    description: rally.description ?? "",
    image: resolveImageUrl(rally.thumbnail_image),
    variant: rally.is_featured ? "featured" : "compact",
    detailPath: `/previous/${rally._id}`,
  };
}

export function mapPastRallyToDetail(rally) {
  const bannerImage = resolveImageUrl(rally.banner_image);
  const thumbnailImage = resolveImageUrl(rally.thumbnail_image, bannerImage);

  return {
    id: rally._id,
    heroContent: {
      title: DEFAULT_HERO_TITLE,
      bgImg: bannerImage,
    },
    summaryCardContent: {
      title: "Discover Our Services",
      items: [
        { label: "Event Name", value: rally.name ?? "—" },
        { label: "Date", value: formatRallySummaryDate(rally.date) || "—" },
        { label: "Location", value: rally.location ?? "—" },
        { label: "Organiser", value: rally.organiser ?? "—" },
      ],
    },
    promoBannerContent: {
      title: DEFAULT_PROMO_TITLE,
      image: bannerImage,
    },
    mainContent: {
      image: thumbnailImage,
      title: rally.name,
      subTitle: STATIC_EVENT_SUBTITLE,
      sectionTitle: "About This Event",
      paragraphs: rally.description ? [rally.description] : [],
      checklist: Array.isArray(rally.highlights) ? rally.highlights : [],
    },
    championsContent: DEFAULT_CHAMPIONS_CONTENT,
    eventId: rally._id,
  };
}

export function findPastRallyById(rallies, rallyId) {
  if (!rallyId || !Array.isArray(rallies)) return null;
  return rallies.find((rally) => rally._id === rallyId) ?? null;
}
