import heroBg from "../../assets/images/hero-bg.png";
import previousRally1 from "../../assets/images/previous-rally-1.png";
import previousRally2 from "../../assets/images/previous-rally-2.jpg";
import previousRally3 from "../../assets/images/previous-rally-3.jpg";
import previousRally4 from "../../assets/images/previous-rally-4.jpg";
import previousRally5 from "../../assets/images/previous-rally-5.jpg";

export const DEFAULT_PREVIOUS_RALLY_ID = "previous-rally-2";

const DEFAULT_HERO_TITLE = "Where Speed Meets\nThe Spirit Of The\nDesert";
const DEFAULT_PROMO_TITLE = "Reliving the\nDesert Thrill";
const DEFAULT_CHAMPIONS_CONTENT = {
  title: "Champions of the Rally",
  subtitle: "Celebrating the top performers who conquered the desert track",
};
const DEFAULT_CHECKLIST = [
  "120+ Professional Racing Events",
  "50+ Elite Drivers Worldwide",
  "International Championship Standards",
  "Advanced Track & Safety System",
];

function buildPreviousRallyDetail({
  id,
  title,
  date,
  summaryDate = date,
  categoryKey = "stock_prepaid",
  description,
  listingImage,
  mainImage,
  promoImage,
  location,
  organiser,
  variant = "compact",
  leadText,
  aboutParagraphs,
}) {
  return {
    id,
    title,
    date,
    categoryKey,
    description,
    variant,
    listingImage,
    detailPath: `/previous/${id}`,
    heroContent: {
      title: DEFAULT_HERO_TITLE,
      bgImg: heroBg,
    },
    summaryCardContent: {
      title: "Discover Our Services",
      items: [
        { label: "Event Name", value: title },
        { label: "Date", value: summaryDate },
        { label: "Location", value: location },
        { label: "Organiser", value: organiser },
      ],
    },
    promoBannerContent: {
      title: DEFAULT_PROMO_TITLE,
      image: promoImage,
    },
    mainContent: {
      image: mainImage,
      title,
      subTitle: leadText,
      sectionTitle: "About This Event",
      paragraphs: aboutParagraphs,
      checklist: DEFAULT_CHECKLIST,
    },
    championsContent: DEFAULT_CHAMPIONS_CONTENT,
    championsCategoryKey: categoryKey,
  };
}

const PREVIOUS_RALLY_DETAILS = {
  "previous-rally-1": buildPreviousRallyDetail({
    id: "previous-rally-1",
    title: "Toronto Motorcycle",
    date: "31 AUGUST, 2025",
    summaryDate: "31-08-2025",
    categoryKey: "dirt_bike",
    description:
      "Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.",
    listingImage: previousRally1,
    mainImage: previousRally1,
    promoImage: previousRally3,
    location: "Toronto Sand Track",
    organiser: "tdcp rally club",
    leadText:
      "A high-energy motorcycle showcase built around loose sand, sharp elevation changes, and endurance-focused desert control.",
    aboutParagraphs: [
      "The Toronto Motorcycle challenge brings together experienced riders for a technical desert course that rewards balance, control, and aggressive pace management.",
      "Competitors face deep sand sections, narrow passing windows, and rapid line changes that demand precision from the opening stretch to the finish zone.",
    ],
  }),
  "previous-rally-2": buildPreviousRallyDetail({
    id: "previous-rally-2",
    title: "Cholistan Desert Rally",
    date: "31 AUGUST, 2025",
    summaryDate: "22-12-2025",
    categoryKey: "stock_prepaid",
    description:
      "Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.",
    listingImage: previousRally2,
    mainImage: previousRally2,
    promoImage: previousRally3,
    location: "Cholistan Desert",
    organiser: "red bull ktm racing",
    variant: "featured",
    leadText:
      "An electrifying night championship event set against the illuminated skyline of Tokyo, featuring elite drivers, precision cornering, and high-speed technical racing under floodlights.",
    aboutParagraphs: [
      "The Tokyo Night Racing Series is one of Racify's most anticipated championship events, combining technical circuit challenges with high-intensity night racing conditions.",
      "Drivers will compete under advanced floodlight systems designed to simulate high-pressure competitive environments. The circuit layout demands precision braking, strategic overtaking, and flawless race execution.",
    ],
  }),
  "previous-rally-3": buildPreviousRallyDetail({
    id: "previous-rally-3",
    title: "Toronto Motorcycle",
    date: "31 AUGUST, 2025",
    summaryDate: "31-08-2025",
    categoryKey: "dirt_bike",
    description:
      "Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.",
    listingImage: previousRally3,
    mainImage: previousRally3,
    promoImage: previousRally4,
    location: "Toronto Race Plains",
    organiser: "tdcp motorsport board",
    leadText:
      "A fast-paced rally stage designed around long acceleration runs, tight corrections, and relentless desert surface transitions.",
    aboutParagraphs: [
      "This edition focused on endurance under pressure, giving riders little recovery time between open straights and control-heavy sand traps.",
      "The event rewarded line discipline, quick reaction time, and a consistent rhythm through the most punishing sectors of the course.",
    ],
  }),
  "previous-rally-4": buildPreviousRallyDetail({
    id: "previous-rally-4",
    title: "Toronto Motorcycle",
    date: "31 AUGUST, 2025",
    summaryDate: "31-08-2025",
    categoryKey: "stock_prepaid",
    description:
      "Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.",
    listingImage: previousRally4,
    mainImage: previousRally4,
    promoImage: previousRally5,
    location: "Toronto Desert Line",
    organiser: "tdcp racing council",
    leadText:
      "Built for spectacle and control, this stage blended open desert speed with heavier technical zones near the crowd-facing sections.",
    aboutParagraphs: [
      "The layout challenged drivers with unstable surfaces, aggressive braking points, and a sequence of corners that punished hesitation.",
      "From the first run to the final checkpoint, racers had to balance momentum with patience to stay clean and competitive.",
    ],
  }),
  "previous-rally-5": buildPreviousRallyDetail({
    id: "previous-rally-5",
    title: "Toronto Motorcycle",
    date: "31 AUGUST, 2025",
    summaryDate: "31-08-2025",
    categoryKey: "stock_prepaid",
    description:
      "Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.",
    listingImage: previousRally5,
    mainImage: previousRally5,
    promoImage: previousRally3,
    location: "Toronto Heritage Dunes",
    organiser: "tdcp off-road series",
    leadText:
      "A crowd-favorite desert rally built around raw acceleration, dust-heavy drifts, and a demanding finish sector.",
    aboutParagraphs: [
      "The course offered a balanced test of speed and stability, stretching riders across wide desert passages before pulling them into tighter tactical zones.",
      "It was a format built for confident overtakes, disciplined handling, and smart energy management over the full event distance.",
    ],
  }),
};

export const PREVIOUS_RALLIES_LIST = Object.values(PREVIOUS_RALLY_DETAILS).map(
  ({
    id,
    title,
    date,
    categoryKey,
    description,
    listingImage,
    variant,
    detailPath,
  }) => ({
    id,
    title,
    date,
    categoryKey,
    description,
    image: listingImage,
    variant,
    detailPath,
  })
);

export function getPreviousRallyDetail(rallyId) {
  return PREVIOUS_RALLY_DETAILS[rallyId] ?? null;
}
