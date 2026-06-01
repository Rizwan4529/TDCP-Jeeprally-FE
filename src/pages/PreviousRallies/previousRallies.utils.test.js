import { describe, expect, it } from "vitest";
import {
  DEFAULT_HERO_TITLE,
  STATIC_EVENT_SUBTITLE,
  arrangeRalliesForListingGrid,
  findPastRallyById,
  formatRallyListingDate,
  getVisibleRalliesForListing,
  mapPastRallyToDetail,
  mapPastRallyToListingCard,
  shouldShowMoreRalliesButton,
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
    expect(detail.promoBannerContent.image).toContain(
      "uploads/images/hero-bg.png",
    );
    expect(detail.mainContent.title).toBe(sampleRally.name);
    expect(detail.mainContent.subTitle).toBe(STATIC_EVENT_SUBTITLE);
    expect(detail.mainContent.paragraphs).toEqual([sampleRally.description]);
    expect(detail.mainContent.checklist).toEqual(sampleRally.highlights);
    expect(detail.summaryCardContent.items).toHaveLength(4);
    expect(detail.eventId).toBe(sampleRally._id);
  });

  it("arranges listing grid with featured in second slot", () => {
    const cards = [
      { id: "a", variant: "compact", title: "A" },
      { id: "b", variant: "compact", title: "B" },
      { id: "c", variant: "featured", title: "C" },
      { id: "d", variant: "compact", title: "D" },
    ];

    const arranged = arrangeRalliesForListingGrid(cards);

    expect(arranged.map((card) => card.id)).toEqual(["a", "c", "b", "d"]);
    expect(arranged[1].variant).toBe("featured");
    expect(arranged.filter((card) => card.variant === "featured")).toHaveLength(
      1,
    );
  });

  it("promotes second rally when none is featured", () => {
    const cards = [
      { id: "a", variant: "compact" },
      { id: "b", variant: "compact" },
      { id: "c", variant: "compact" },
    ];

    const arranged = arrangeRalliesForListingGrid(cards);

    expect(arranged.map((card) => card.id)).toEqual(["a", "b", "c"]);
    expect(arranged[1].variant).toBe("featured");
  });

  it("limits visible rallies until show all", () => {
    const rallies = Array.from({ length: 7 }, (_, index) => ({
      id: String(index),
    }));

    expect(getVisibleRalliesForListing(rallies, false)).toHaveLength(5);
    expect(getVisibleRalliesForListing(rallies, true)).toHaveLength(7);
    expect(shouldShowMoreRalliesButton(rallies, false)).toBe(true);
    expect(shouldShowMoreRalliesButton(rallies, true)).toBe(false);
    expect(shouldShowMoreRalliesButton(rallies.slice(0, 5), false)).toBe(false);
  });

  it("finds rally by id", () => {
    expect(findPastRallyById([sampleRally], sampleRally._id)).toEqual(
      sampleRally,
    );
    expect(findPastRallyById([sampleRally], "missing")).toBeNull();
  });
});
