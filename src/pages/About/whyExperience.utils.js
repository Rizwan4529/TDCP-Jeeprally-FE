export const WHY_EXPERIENCE_ASSETS = {
  jeep: "/assets/images/aboutus-experience-jeep.png",
  circle: "/assets/images/about-us-experience-circle.png",
  iconLeft: "/assets/images/experience-left.png",
  iconRight: "/assets/images/experience-right.png",
};

export const DEFAULT_WHY_EXPERIENCE = {
  title: "Why Experience the Rally",
  description:
    "TDCP Jeep Rally combines high-octane off-road racing with the culture, landscape, and spirit of the desert — built for drivers, fans, and adventurers alike.",
  jeepImage: WHY_EXPERIENCE_ASSETS.jeep,
  circleImage: WHY_EXPERIENCE_ASSETS.circle,
  features: [
    {
      id: "high-speed-racing",
      title: "High-Speed Racing",
      description: "Experience adrenaline-fueled competition",
      iconUrl: null,
      iconFallback: WHY_EXPERIENCE_ASSETS.iconLeft,
    },
    {
      id: "desert-terrain",
      title: "Desert Terrain",
      description: "Challenging dunes and rugged tracks",
      iconUrl: null,
      iconFallback: WHY_EXPERIENCE_ASSETS.iconRight,
    },
    {
      id: "cultural-experience",
      title: "Cultural Experience",
      description: "Music, camps, and local traditions",
      iconUrl: null,
      iconFallback: WHY_EXPERIENCE_ASSETS.iconLeft,
    },
    {
      id: "massive-participation",
      title: "Massive Participation",
      description: "Drivers, tourists, and spectators",
      iconUrl: null,
      iconFallback: WHY_EXPERIENCE_ASSETS.iconRight,
    },
  ],
};

export function getWhyExperienceFeatureIconFallback(index) {
  return index % 2 === 0
    ? WHY_EXPERIENCE_ASSETS.iconLeft
    : WHY_EXPERIENCE_ASSETS.iconRight;
}

function mapWhyExperienceFeature(item, index) {
  return {
    id: String(item?.id ?? item?._id ?? `feature-${index}`),
    title: item?.title || "Feature",
    description: item?.subTitle ?? item?.subtitle ?? item?.description ?? "",
    iconUrl: item?.image ?? null,
    iconFallback: getWhyExperienceFeatureIconFallback(index),
  };
}

/**
 * Maps CMS `about` → `whyExperience` section to view model.
 * Falls back to DEFAULT_WHY_EXPERIENCE when section or items are missing.
 */
export function mapWhyExperienceContent(content) {
  if (!content) {
    return { ...DEFAULT_WHY_EXPERIENCE, isFromApi: false };
  }

  const apiItems = Array.isArray(content.items)
    ? content.items.filter((item) => item?.title)
    : [];

  const features =
    apiItems.length > 0
      ? apiItems.map(mapWhyExperienceFeature)
      : DEFAULT_WHY_EXPERIENCE.features;

  return {
    title: content.title || DEFAULT_WHY_EXPERIENCE.title,
    description:
      content.subTitle ??
      content.subtitle ??
      content.description ??
      DEFAULT_WHY_EXPERIENCE.description,
    jeepImage: content.image || DEFAULT_WHY_EXPERIENCE.jeepImage,
    circleImage:
      content.bgImage ||
      content.circleImg ||
      DEFAULT_WHY_EXPERIENCE.circleImage,
    features,
    isFromApi: Boolean(
      content.title ||
        content.subTitle ||
        content.subtitle ||
        content.image ||
        apiItems.length > 0,
    ),
  };
}

export function shouldShowWhyExperienceSection(content) {
  const mapped = mapWhyExperienceContent(content);
  return Boolean(mapped.title && mapped.features.length > 0);
}
