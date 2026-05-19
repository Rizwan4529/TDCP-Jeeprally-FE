import { describe, expect, it } from "vitest";
import {
  DEFAULT_WHY_EXPERIENCE,
  mapWhyExperienceContent,
  shouldShowWhyExperienceSection,
} from "./whyExperience.utils.js";

const API_SECTION = {
  id: "whyExperience",
  title: "Why Experience the Rally",
  subTitle:
    "TDCP Jeep Rally combines high-octane off-road racing with the culture, landscape, and spirit of the desert — built for drivers, fans, and adventurers alike.",
  image: "/uploads/images/aboutus-experience-jeep.png",
  items: [
    {
      id: 1,
      title: "High-Speed Racing",
      subTitle: "Experience adrenaline-fueled competition",
      image: "/uploads/images/experience-left.png",
    },
    {
      id: 2,
      title: "Desert Terrain",
      subTitle: "Challenging dunes and rugged tracks",
      image: "/uploads/images/experience-right.png",
    },
  ],
};

describe("mapWhyExperienceContent", () => {
  it("returns defaults when content is null", () => {
    const result = mapWhyExperienceContent(null);
    expect(result.title).toBe(DEFAULT_WHY_EXPERIENCE.title);
    expect(result.features).toHaveLength(4);
    expect(result.isFromApi).toBe(false);
  });

  it("maps CMS whyExperience section fields", () => {
    const result = mapWhyExperienceContent(API_SECTION);
    expect(result.title).toBe("Why Experience the Rally");
    expect(result.description).toContain("TDCP Jeep Rally");
    expect(result.jeepImage).toBe("/uploads/images/aboutus-experience-jeep.png");
    expect(result.features).toHaveLength(2);
    expect(result.features[0].id).toBe("1");
    expect(result.features[0].iconUrl).toBe(
      "/uploads/images/experience-left.png",
    );
    expect(result.isFromApi).toBe(true);
  });

  it("uses default features when CMS items array is empty", () => {
    const result = mapWhyExperienceContent({
      title: "Custom title",
      subTitle: "Custom description",
      items: [],
    });
    expect(result.title).toBe("Custom title");
    expect(result.description).toBe("Custom description");
    expect(result.features).toHaveLength(4);
  });
});

describe("shouldShowWhyExperienceSection", () => {
  it("is true for API section and defaults", () => {
    expect(shouldShowWhyExperienceSection(API_SECTION)).toBe(true);
    expect(shouldShowWhyExperienceSection(null)).toBe(true);
  });
});
