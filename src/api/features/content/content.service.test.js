import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../axios.jsx";
import * as contentService from "./content.service.jsx";

vi.mock("../../axios.jsx", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("fetchCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("unwraps category data from the standard success response", async () => {
    expect(typeof contentService.fetchCategories).toBe("function");

    api.get.mockResolvedValue({
      data: {
        success: true,
        message: "Categories fetched successfully",
        data: [
          { _id: "1", title: "Stock Prepaid", key: "stock_prepaid" },
          { _id: "2", title: "Jeep", key: "jeep" },
        ],
      },
    });

    await expect(contentService.fetchCategories()).resolves.toEqual([
      { _id: "1", title: "Stock Prepaid", key: "stock_prepaid" },
      { _id: "2", title: "Jeep", key: "jeep" },
    ]);
    expect(api.get).toHaveBeenCalledWith("/categories");
  });

  it("throws when the API wrapper marks the request as unsuccessful", async () => {
    expect(typeof contentService.fetchCategories).toBe("function");

    api.get.mockResolvedValue({
      data: {
        success: false,
        message: "Unable to fetch categories",
      },
    });

    await expect(contentService.fetchCategories()).rejects.toThrow(
      "Unable to fetch categories"
    );
  });
});

describe("resolveCategoryImageUrl", () => {
  it("joins category image paths against the backend origin without duplicate slashes", () => {
    expect(typeof contentService.resolveCategoryImageUrl).toBe("function");

    vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3000/api/v1");

    expect(
      contentService.resolveCategoryImageUrl("//uploads//images//jeep.png")
    ).toBe("http://localhost:3000/uploads/images/jeep.png");
  });
});
