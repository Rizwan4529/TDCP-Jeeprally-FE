import { beforeEach, describe, expect, it, vi } from "vitest";
import rallyAxios from "../../rallyAxios.jsx";
import * as rallyService from "./rally.service.jsx";

vi.mock("../../rallyAxios.jsx", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchRallyChampions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unwraps champions data for an event and category", async () => {
    expect(typeof rallyService.fetchRallyChampions).toBe("function");

    rallyAxios.get.mockResolvedValue({
      data: {
        success: true,
        message: "Champions fetched successfully",
        data: [
          {
            _id: "1",
            position: 1,
            category: "stock_prepaid",
            image: "uploads\\images\\champion.png",
            team_id: {
              team_name: "Sahiwal Sand Runners",
              driver_id: { name: "Muhammad Rizwan" },
            },
          },
        ],
      },
    });

    await expect(
      rallyService.fetchRallyChampions("event-1", "stock_prepaid")
    ).resolves.toEqual([
      expect.objectContaining({
        _id: "1",
        position: 1,
        category: "stock_prepaid",
      }),
    ]);

    expect(rallyAxios.get).toHaveBeenCalledWith("/rally/event-1/champions", {
      params: { category: "stock_prepaid" },
    });
  });

  it("throws when champions request is unsuccessful", async () => {
    expect(typeof rallyService.fetchRallyChampions).toBe("function");

    rallyAxios.get.mockResolvedValue({
      data: {
        success: false,
        message: "Unable to fetch champions",
      },
    });

    await expect(
      rallyService.fetchRallyChampions("event-1", "stock_prepaid")
    ).rejects.toThrow("Unable to fetch champions");
  });
});

describe("fetchRallyVideos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("unwraps the videos list from the videos response", async () => {
    expect(typeof rallyService.fetchRallyVideos).toBe("function");

    rallyAxios.get.mockResolvedValue({
      data: {
        success: true,
        message: "Videos fetched successfully",
        data: [
          {
            _id: "video-2",
            title: "new video 2",
            url: "/uploads/videos/1778778748948-443320057.mp4",
          },
          {
            _id: "video-1",
            title: "new video 1",
            url: "/uploads/videos/1778778747489-839092702.mp4",
          },
        ],
      },
    });

    await expect(rallyService.fetchRallyVideos()).resolves.toEqual([
      expect.objectContaining({
        _id: "video-2",
        video_url: "/uploads/videos/1778778748948-443320057.mp4",
      }),
      expect.objectContaining({
        _id: "video-1",
        video_url: "/uploads/videos/1778778747489-839092702.mp4",
      }),
    ]);

    expect(rallyAxios.get).toHaveBeenCalledWith("/videos");
  });

  it("builds a streamable full video url on the rally backend origin", () => {
    expect(typeof rallyService.resolveRallyVideoUrl).toBe("function");

    vi.stubEnv("VITE_RALLY_API_BASE_URL", "http://localhost:3000/api/v1");

    expect(
      rallyService.resolveRallyVideoUrl(
        "uploads/videos/1778760310438-419130833.mp4"
      )
    ).toBe("http://localhost:3000/uploads/videos/1778760310438-419130833.mp4");
  });
});

describe("fetchRallyCompetitors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unwraps approved competitors for an event and category", async () => {
    expect(typeof rallyService.fetchRallyCompetitors).toBe("function");

    rallyAxios.get.mockResolvedValue({
      data: {
        success: true,
        message: "Competitors fetched successfully",
        data: [
          {
            _id: "registration-1",
            category: "stock_prepaid",
            team_id: {
              team_number: "T-001",
              driver_id: {
                name: "Muhammad Rizwan",
                profile_image: "uploads/images/profile.png",
              },
            },
          },
        ],
      },
    });

    await expect(
      rallyService.fetchRallyCompetitors("event-1", "stock_prepaid")
    ).resolves.toEqual([
      expect.objectContaining({
        _id: "registration-1",
        category: "stock_prepaid",
      }),
    ]);

    expect(rallyAxios.get).toHaveBeenCalledWith("/rally/event-1/competitors", {
      params: { category: "stock_prepaid" },
    });
  });

  it("throws when competitors request is unsuccessful", async () => {
    expect(typeof rallyService.fetchRallyCompetitors).toBe("function");

    rallyAxios.get.mockResolvedValue({
      data: {
        success: false,
        message: "Unable to fetch competitors",
      },
    });

    await expect(
      rallyService.fetchRallyCompetitors("event-1", "stock_prepaid")
    ).rejects.toThrow("Unable to fetch competitors");
  });
});

describe("fetchRallyChallenges", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unwraps challenges for an event", async () => {
    expect(typeof rallyService.fetchRallyChallenges).toBe("function");

    rallyAxios.get.mockResolvedValue({
      data: {
        success: true,
        message: "Challenges fetched successfully",
        data: [
          {
            _id: "challenge-1",
            title: "24hr Bike Race",
            description: "A gruelling 24-hour endurance challenge.",
            image: "uploads\\images\\1778596798487-251031038.png",
            category: "stock_prepaid",
          },
          {
            _id: "challenge-2",
            title: "Cholistan Desert Rally",
            description: "The main event open to all categories.",
            image: null,
            category: null,
          },
        ],
      },
    });

    await expect(rallyService.fetchRallyChallenges("event-1")).resolves.toEqual([
      expect.objectContaining({
        _id: "challenge-1",
        title: "24hr Bike Race",
        image: "uploads\\images\\1778596798487-251031038.png",
      }),
      expect.objectContaining({
        _id: "challenge-2",
        title: "Cholistan Desert Rally",
      }),
    ]);

    expect(rallyAxios.get).toHaveBeenCalledWith("/rally/event-1/challenges");
  });

  it("throws when challenges request is unsuccessful", async () => {
    expect(typeof rallyService.fetchRallyChallenges).toBe("function");

    rallyAxios.get.mockResolvedValue({
      data: {
        success: false,
        message: "Unable to fetch challenges",
      },
    });

    await expect(rallyService.fetchRallyChallenges("event-1")).rejects.toThrow(
      "Unable to fetch challenges"
    );
  });
});
