import { describe, expect, it } from "vitest";
import {
  DEFAULT_HERO_TITLE,
  STATIC_EVENT_SUBTITLE,
  findPastRallyById,
  formatRallyListingDate,
  mapPastRallyToDetail,
  mapPastRallyToListingCard,
} from "./previousRallies.utils.js";

const sampleRally = {
  _id: "6a06bd1bc2a32fc10c4211ad",
  name: "TDCP Salt Range Rally 2024",
  date: "2024-10-04T00:00:00.000Z",
  location: "Salt Range, Khushab, Punjab",
  organiser: "Tourism Development Corporation of Punjab (TDCP)",
  description: "The 3rd edition returned to Punjab with the dramatic Salt Range as its backdrop.",
  banner_image: "uploads/images/hero-bg.png",
  thumbnail_image: "uploads/images/social-3.png",
  is_featured: true,
  highlights: [
    "Dramatic Salt Range ridges and river crossings",
    "Highest ever participation — 78 registered teams",
  ],
};

describe("previousRallies utils", () => {
  it("formats listing dates in uppercase", () => {
    expect(formatRallyListingDate("2024-10-04T00:00:00.000Z")).toBe(
      "04 OCTOBER 2024",
    );
  });

  it("maps API rally to listing card", () => {
    const card = mapPastRallyToListingCard(sampleRally);

    expect(card).toEqual(
      expect.objectContaining({
        id: sampleRally._id,
        title: sampleRally.name,
        description: sampleRally.description,
        variant: "featured",
        detailPath: `/previous/${sampleRally._id}`,
      }),
    );
    expect(card.image).toContain("uploads/images/social-3.png");
  });

  it("maps API rally to detail view with static hero title and subtitle", () => {
    const detail = mapPastRallyToDetail(sampleRally);

    expect(detail.heroContent.title).toBe(DEFAULT_HERO_TITLE);
    expect(detail.heroContent.bgImg).toContain("uploads/images/hero-bg.png");
    expect(detail.mainContent.title).toBe(sampleRally.name);
    expect(detail.mainContent.subTitle).toBe(STATIC_EVENT_SUBTITLE);
    expect(detail.mainContent.paragraphs).toEqual([sampleRally.description]);
    expect(detail.mainContent.checklist).toEqual(sampleRally.highlights);
    expect(detail.summaryCardContent.items).toHaveLength(4);
    expect(detail.eventId).toBe(sampleRally._id);
  });

  it("finds rally by id", () => {
    expect(findPastRallyById([sampleRally], sampleRally._id)).toEqual(
      sampleRally,
    );
    expect(findPastRallyById([sampleRally], "missing")).toBeNull();
  });
});
