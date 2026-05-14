import { beforeEach, describe, expect, it, vi } from "vitest";
import rallyAxios from "../../rallyAxios.jsx";
import { fetchWebsiteContent } from "./websiteContent.service.jsx";

vi.mock("../../rallyAxios.jsx", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchWebsiteContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unwraps the first content document payload", async () => {
    rallyAxios.get.mockResolvedValue({
      data: {
        success: true,
        message: "Contents fetched successfully",
        data: [
          {
            _id: "content-doc-1",
            content: {
              theme: { primaryColor: "#48AA71" },
              pages: [{ id: "home", sections: [] }],
            },
          },
        ],
      },
    });

    await expect(fetchWebsiteContent()).resolves.toEqual({
      theme: { primaryColor: "#48AA71" },
      pages: [{ id: "home", sections: [] }],
    });
    expect(rallyAxios.get).toHaveBeenCalledWith("/content/all");
  });

  it("throws when the website content request is unsuccessful", async () => {
    rallyAxios.get.mockResolvedValue({
      data: {
        success: false,
        message: "Unable to fetch content",
      },
    });

    await expect(fetchWebsiteContent()).rejects.toThrow(
      "Unable to fetch content"
    );
  });
});
