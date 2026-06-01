import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../axios.jsx";
import { fetchWebsiteContent } from "./websiteContent.service.jsx";

vi.mock("../../axios.jsx", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchWebsiteContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("unwraps the first content document payload", async () => {
    api.get.mockResolvedValue({
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
    expect(api.get).toHaveBeenCalledWith("/content/all");
  });

  it("throws when the website content request is unsuccessful", async () => {
    api.get.mockResolvedValue({
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
