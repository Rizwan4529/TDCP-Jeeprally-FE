import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../axios.jsx";
import * as rallyService from "./rally.service.jsx";

vi.mock("../../axios.jsx", () => ({
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

    api.get.mockResolvedValue({
      data: {
        success: true,
        message: "Champions fetched successfully",
        data: [
          {
            _id: "1",
            position: 1,
            category_id: {
              _id: "cat-1",
              key: "stock_prepaid",
              title: "Stock Prepaid",
            },
            image: null,
            team_id: {
              team_name: "Sahiwal Sand Runners",
              team_number: "#22",
              category: "stock_prepaid",
            },
            driver: {
              name: "Muhammad Rizwan",
              profile_image: "uploads\\images\\champion.png",
            },
            navigator: null,
          },
        ],
      },
    });

    await expect(
      rallyService.fetchRallyChampions("event-1", "cat-1")
    ).resolves.toEqual([
      expect.objectContaining({
        _id: "1",
        position: 1,
        team_id: expect.objectContaining({
          category: "stock_prepaid",
        }),
        driver: expect.objectContaining({
          name: "Muhammad Rizwan",
        }),
      }),
    ]);

    expect(api.get).toHaveBeenCalledWith("/rally/event-1/champions", {
      params: { category_id: "cat-1" },
    });
  });

  it("throws when champions request is unsuccessful", async () => {
    expect(typeof rallyService.fetchRallyChampions).toBe("function");

    api.get.mockResolvedValue({
      data: {
        success: false,
        message: "Unable to fetch champions",
      },
    });

    await expect(
      rallyService.fetchRallyChampions("event-1", "cat-1")
    ).rejects.toThrow("Unable to fetch champions");
  });
});

describe("fetchDriverRankingsParticipation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unwraps participation chart data for a driver user id", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        message: "Rankings participation data fetched successfully",
        data: {
          by_year: [
            { year: 2023, tdcp: 2, other: 0 },
            { year: 2024, tdcp: 1, other: 3 },
          ],
        },
      },
    });

    await expect(
      rallyService.fetchDriverRankingsParticipation(
        "69f988d447844ddd29331289",
      ),
    ).resolves.toEqual({
      by_year: [
        { year: 2023, tdcp: 2, other: 0 },
        { year: 2024, tdcp: 1, other: 3 },
      ],
    });

    expect(api.get).toHaveBeenCalledWith(
      "/rankings/driver/69f988d447844ddd29331289",
    );
  });
});

describe("fetchDriverRaceHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unwraps driver race history for standing panels", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        message: "Driver race history fetched successfully",
        data: {
          driver_id: "69f988d447844ddd29331289",
          tdcp_races: [{ _id: "reg-1", year: 2026 }],
          other_races: [],
          totals: { tdcp: 1, other: 0, all: 1 },
        },
      },
    });

    await expect(
      rallyService.fetchDriverRaceHistory("69f988d447844ddd29331289"),
    ).resolves.toEqual({
      driver_id: "69f988d447844ddd29331289",
      tdcp_races: [{ _id: "reg-1", year: 2026 }],
      other_races: [],
      totals: { tdcp: 1, other: 0, all: 1 },
    });

    expect(api.get).toHaveBeenCalledWith(
      "/rankings/driver/69f988d447844ddd29331289/races",
    );
  });

  it("throws when race history request is unsuccessful", async () => {
    api.get.mockResolvedValue({
      data: {
        success: false,
        message: "Unable to fetch race history",
      },
    });

    await expect(
      rallyService.fetchDriverRaceHistory("69f988d447844ddd29331289"),
    ).rejects.toThrow("Unable to fetch race history");
  });
});

describe("fetchRallyVideos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("unwraps the videos list from the videos response", async () => {
    expect(typeof rallyService.fetchRallyVideos).toBe("function");

    api.get.mockResolvedValue({
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

    expect(api.get).toHaveBeenCalledWith("/videos");
  });

  it("builds a streamable full video url on the rally backend origin", () => {
    expect(typeof rallyService.resolveRallyVideoUrl).toBe("function");

    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3000/api/v1");

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

    api.get.mockResolvedValue({
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

    expect(api.get).toHaveBeenCalledWith("/rally/event-1/competitors", {
      params: { category: "stock_prepaid" },
    });
  });

  it("throws when competitors request is unsuccessful", async () => {
    expect(typeof rallyService.fetchRallyCompetitors).toBe("function");

    api.get.mockResolvedValue({
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

    api.get.mockResolvedValue({
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

    expect(api.get).toHaveBeenCalledWith("/rally/event-1/challenges");
  });

  it("throws when challenges request is unsuccessful", async () => {
    expect(typeof rallyService.fetchRallyChallenges).toBe("function");

    api.get.mockResolvedValue({
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

describe("fetchCompletedRallies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches completed rally events", async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ _id: "event-1", status: "completed" }],
      },
    });

    await expect(rallyService.fetchCompletedRallies()).resolves.toEqual([
      { _id: "event-1", status: "completed" },
    ]);

    expect(api.get).toHaveBeenCalledWith("/rally", {
      params: { status: "completed" },
    });
  });
});
